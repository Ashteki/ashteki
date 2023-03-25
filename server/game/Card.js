const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CardAction = require('./cardaction.js');
const PlayAction = require('./BaseActions/PlayAction');
const PlayAllyAction = require('./BaseActions/PlayAllyAction');
const PlayReadySpellAction = require('./BaseActions/PlayReadySpellAction');
const PlayUpgradeAction = require('./BaseActions/PlayUpgradeAction');
const {
    CardType,
    BattlefieldTypes,
    UpgradeCardTypes,
    AbilityType,
    ConjuredCardTypes,
    Magic,
    PhoenixbornTypes
} = require('../constants.js');
const PlayableObject = require('./PlayableObject.js');
const { parseCosts } = require('./costs.js');
const PlayPbUpgradeAction = require('./BaseActions/PlayPbUpgradeAction.js');

class Card extends PlayableObject {
    constructor(owner, cardData) {
        super(owner.game);
        this.owner = owner;
        this.setDefaultController(owner);

        this.cardData = cardData;
        this.isChained = cardData.isChained;
        if (owner.user.altArts) {
            if (
                owner.user.altArts[this.cardData.stub] &&
                owner.user.altArts[this.cardData.stub].length
            ) {
                this.altArts = [cardData.stub, ...owner.user.altArts[this.cardData.stub]];
            }
        }

        this.id = cardData.stub;
        this.printedName = cardData.name;
        // this is the default imageStub for the card - this can be overridden by alt arts later
        this.imageStub = cardData.imageStub || cardData.stub;
        this.printedType = cardData.type;
        this.index = 0;

        this.playCost = cardData.cost ? parseCosts(cardData.cost) : [];
        this.magicCost = this.getMagicCost(cardData);
        this.conjurations = cardData.conjurations || [];
        this.phoenixborn = cardData.phoenixborn;
        this.placement = cardData.placement;

        this.tokens = {};
        this.flags = {};
        this.printedKeywords = {};
        for (let keyword of cardData.keywords || []) {
            let split = keyword.split(':');
            let value = 1;
            if (split.length > 1) {
                value = parseInt(split[1]);
            }

            this.printedKeywords[split[0]] = value;
            this.persistentEffect({
                location: 'any',
                effect: AbilityDsl.effects.addKeyword({ [split[0]]: value })
            });
        }

        this.upgrades = [];
        this.dieUpgrades = [];

        this.childCards = [];

        this.printedAttack = cardData.attack || 0;
        this.printedLife = cardData.life || 0;
        this.printedRecover = cardData.recover || 0;
        this.threat = cardData.threat;
        this.blood = cardData.blood;
        this.printedUltimate = cardData.ultimate;
        this.target = cardData.target;
        this.setup = cardData.setup;
        this.printedBattlefield = cardData.battlefield;
        this.printedSpellboard = cardData.spellboard;

        this.moribund = false;

        this.menu = [
            { command: 'tokens', text: 'Modify tokens', menu: 'main' },
            { command: 'moves', text: 'Move', menu: 'main' },
            { command: 'main', text: 'Back', menu: 'tokens' },
            { command: 'main', text: 'Back', menu: 'moves' },
            { command: 'addExhaustion', text: 'Add 1 exhaustion', menu: 'tokens' },
            { command: 'remExhaustion', text: 'Remove 1 exhaustion', menu: 'tokens' },
            { command: 'addDamage', text: 'Add 1 damage', menu: 'tokens' },
            { command: 'remDamage', text: 'Remove 1 damage', menu: 'tokens' },
            { command: 'addStatus', text: 'Add 1 status', menu: 'tokens' },
            { command: 'remStatus', text: 'Remove 1 status', menu: 'tokens' },
            { command: 'addGravityFlux', text: 'Add 1 gravity flux exhaustion', menu: 'tokens' },
            { command: 'remGravityFlux', text: 'Remove gravity flux exhaustion', menu: 'tokens' },
            { command: 'moveHand', text: 'Move to hand', menu: 'moves' },
            { command: 'moveDiscard', text: 'Move to discard', menu: 'moves' },
            { command: 'movePlay', text: 'Move to play area', menu: 'moves' },
            { command: 'remEffects', text: 'Remove temporary effects', menu: 'main' }
        ];
        if (ConjuredCardTypes.includes(this.type)) {
            this.menu.push({ command: 'moveConjuration', text: 'Move to conjuration pile', menu: 'moves' });
        }
        if (this.type === CardType.Phoenixborn) {
            this.menu.push({ command: 'guarded', text: 'Toggle guarded', menu: 'main' });
        }
        if (BattlefieldTypes.includes(this.type)) {
            this.menu.push({ command: 'control', text: 'Give control', menu: 'main' });
        }

        this.endRound();
        this.modifiedAttack = undefined;
        this.modifiedLife = undefined;
        this.modifiedBattlefield = undefined;
        this.modifiedSpellboard = undefined;
        this.modifiedRecover = undefined;
        this.usedGuardThisRound = false;
        this.actsAs = undefined;
    }

    getImageStub() {
        return this.imageStub;
    }

    get name() {
        const copyEffect = this.mostRecentEffect('copyCard');
        return copyEffect ? copyEffect.printedName : this.printedName;
    }

    get type() {
        return this.mostRecentEffect('changeType') || this.printedType;
    }

    get discardLocation() {
        return this.type == 'Conjuration' || this.type === 'Conjured Alteration Spell'
            ? 'archives'
            : 'discard';
    }

    getMagicCost(cardData) {
        let result = 0;
        if (cardData.magicCost) {
            result = Object.values(cardData.magicCost).reduce((acc, val) => acc + val, result);
        }

        return result;
    }

    get actions() {
        if (this.isBlank()) {
            return [];
        }

        let actions = this.abilities.actions;
        if (this.anyEffect('copyCard')) {
            let mostRecentEffect = _.last(
                this.effects.filter((effect) => effect.type === 'copyCard')
            );
            actions = mostRecentEffect.value.getActions(this);
        }

        let effectActions = this.getEffects('gainAbility').filter(
            (ability) => ability.abilityType === 'action'
        );
        return actions.concat(effectActions);
    }

    setupAbilities() {
        this.setupKeywordAbilities(AbilityDsl);
        this.setupCardAbilities(AbilityDsl);
    }

    /**
     * Create card abilities by calling subsequent methods with appropriate properties
     * @param ability - object containing limits, costs, effects, and game actions
     */
    // eslint-disable-next-line no-unused-vars
    setupCardAbilities(ability) { }


    // These are ACQUIRED triggered abilities that are NUMERIC and therefore need to stack
    // They are set up here to prevent multiple gainAbility triggers
    // acquired abilities that are not reactions etc do not need to setup here.
    setupKeywordAbilities(ability) {
        // Overkill
        if (BattlefieldTypes.includes(this.type)) {
            this.abilities.keywordReactions.push(
                this.afterDestroysFighting({
                    title: 'overkill',
                    condition: (context) => context.source.getKeywordValue('overkill'),
                    autoResolve: true,
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.source.getKeywordValue('overkill'),
                        target: context.player.opponent.phoenixborn
                    }))
                })
            );
        }

        // Hunt
        if (BattlefieldTypes.includes(this.type)) {
            this.abilities.keywordReactions.push(
                this.forcedReaction({
                    title: 'Hunt',
                    condition: (context) => context.source.getKeywordValue('Hunt'),
                    when: {
                        onAttackersDeclared: (event, context) => {
                            return event.battles.some((b) => b.attacker === context.source);
                        }
                    },
                    target: {
                        optional: true,
                        activePromptTitle: 'Choose a unit to damage',
                        cardType: BattlefieldTypes,
                        controller: 'opponent',
                        gameAction: ability.actions.dealDamage((context) => ({
                            amount: context.source.getKeywordValue('hunt')
                        }))
                    }
                })
            );
        }

        if (BattlefieldTypes.includes(this.type)) {
            this.abilities.keywordReactions.push(
                this.forcedReaction({
                    title: 'Group Tactics',
                    condition: (context) => context.source.getKeywordValue('grouptactics'),
                    may: (context) => 'add ' + context.source.getKeywordValue('grouptactics') + " to this unit's attack",
                    skipMay: (context) => context.game.activePlayer.optionSettings.alwaysGroupTactics,
                    when: {
                        onAttackersDeclared: (event, context) => {
                            return (
                                event.attackingPlayer === context.source.controller &&
                                event.battles.length >= 3
                            );
                        }
                    },
                    gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                        target: this,
                        effect: AbilityDsl.effects.modifyAttack(context.source.getKeywordValue('grouptactics')),
                        duration: 'untilEndOfTurn'
                    })),
                    effect: 'increase its attack value by {0}',
                    effectArgs: (context) => context.source.getKeywordValue('grouptactics')
                })
            );
        }
    }

    /**
     * @typedef {('play area'|'discard'|'archives'|'being played'|'draw')} CardLocation
     */

    /**
     * Declares an ability triggered when the card is played
     * @param {object} properties Object defining the ability
     */
    play(properties) {
        if (this.type === CardType.ActionSpell) {
            properties.location = properties.location || 'being played';
        }

        return this.forcedReaction(Object.assign({ play: true, name: 'Play' }, properties));
    }

    ambush(amount) {
        return this.entersPlay({
            title: 'Ambush ' + amount,
            effect: 'deal ' + amount + ' damage to a phoenixborn',
            target: {
                activePromptTitle: 'Ambush ' + amount + ': Choose a Phoenixborn',
                gameAction: AbilityDsl.actions.dealDamage({ amount: amount, showMessage: true }),
                cardType: 'Phoenixborn',
                optional: true
            }
        });
    }

    fleeting() {
        return this.forcedInterrupt({
            autoResolve: true,
            inexhaustible: true,
            title: 'Fleeting',
            when: {
                onRoundEnded: () => true
            },
            gameAction: AbilityDsl.actions.discard((context) => ({
                card: context.source
            }))
        });
    }

    fade() {
        return this.forcedInterrupt({
            inexhaustible: true,
            title: 'Fade',
            when: {
                onRoundEnded: () => true
            },
            gameAction: AbilityDsl.actions.destroy()
        });
    }

    destroyed(properties) {
        return this.forcedInterrupt(
            Object.assign(
                {
                    when: {
                        onCardDestroyed: (event, context) => event.card === context.source
                    },
                    destroyed: true
                },
                properties
            )
        );
    }

    destroyedOrDiscarded(properties) {
        return this.forcedInterrupt(
            Object.assign(
                {
                    when: {
                        // onCardDestroyed: (event, context) => event.card === context.source,
                        onCardLeavesPlay: (event, context) =>
                            event.card === context.source &&
                            event.triggeringEvent &&
                            event.triggeringEvent.name === 'onCardDestroyed',

                        onCardDiscarded: (event, context) => event.card === context.source &&
                            event.clone.location === 'play area'
                    },
                    destroyed: true
                },
                properties
            )
        );
    }

    inheritance() {
        return this.destroyed({
            title: 'Inheritance 1',
            inexhaustible: true,
            target: {
                optional: true,
                activePromptTitle: 'Inheritance 1',
                cardType: BattlefieldTypes,
                cardCondition: (card, context) => card !== context.source,
                gameAction: AbilityDsl.actions.addStatusToken(() => ({
                    amount: this.getAbilityNumeric(1)
                }))
            }
        });
    }

    afterDestroysFighting(properties) {
        // NOTE: this is not AFTER Destroy ==> forcedReaction to destroy.
        // This has to happen before the onCardLeavesPlay because when a card is moved the event
        // listeners are removed from the game - so a card like iron Rhino can't overkill if it is
        // destroyed in the simultaneous damage.
        return this.forcedInterrupt(
            Object.assign(
                {
                    when: {
                        onCardLeavesPlay: (event, context) =>
                            event.triggeringEvent &&
                            event.triggeringEvent.name === 'onCardDestroyed' &&
                            event.triggeringEvent.damageEvent &&
                            event.triggeringEvent.damageEvent.fightEvent &&
                            event.triggeringEvent.damageEvent.damageSource === context.source &&
                            event.triggeringEvent.damageEvent.fightEvent.attacker === context.source
                    }
                },
                properties
            )
        );
    }

    afterDestroyedDefending(properties) {
        // NOTE: this is not AFTER Destroy ==> forcedReaction to destroy.
        // This has to happen before the onCardLeavesPlay because when a card is moved the event
        // listeners are removed from the game - so a card like iron Rhino can't overkill if it is
        // destroyed in the simultaneous damage.
        return this.forcedInterrupt(
            Object.assign(
                {
                    when: {
                        onCardLeavesPlay: (event, context) =>
                            event.card === context.source &&
                            event.triggeringEvent &&
                            event.triggeringEvent.name === 'onCardDestroyed' &&
                            event.triggeringEvent.damageEvent &&
                            event.triggeringEvent.damageEvent.fightEvent &&
                            event.triggeringEvent.damageEvent.fightEvent.attacker.controller ===
                            context.player.opponent //opponent attacked
                    }
                },
                properties
            )
        );
    }

    entersPlay(properties) {
        return this.forcedReaction(
            Object.assign(
                { when: { onCardEntersPlay: (event, context) => event.card === context.source } },
                properties
            )
        );
    }

    leavesPlay(properties) {
        return this.forcedInterrupt(
            Object.assign(
                { when: { onCardLeavesPlay: (event, context) => event.card === context.source } },
                properties
            )
        );
    }

    entersSpellboard(properties) {
        return this.forcedReaction(
            Object.assign(
                { when: { onSpellbookPlayed: (event, context) => event.card === context.source } },
                properties
            )
        );
    }

    /**
     * Creates an action for a card that can be used by the player when clicking
     * @param {object} properties properties object describing the cost, title, and any then: clause
     * @returns created CardAction
     */
    action(properties) {
        const action = new CardAction(this.game, this, properties);
        if (action.printedAbility) {
            this.abilities.actions.push(action);
        }

        return action;
    }

    /**
     * Wrapper method to card.action() to declare a summon ability. Includes a warning if at conjuration limit
     * @param {string} cardId The 'card-stub' of the conjuration to summon e.g. 'silver-snake'
     * @param {object} properties properties object describing the cost, title, and any then: clause
     * @returns CardAction result of call to card.action
     */
    summon(cardId, properties) {
        return this.action(
            Object.assign(
                {
                    gameAction: AbilityDsl.actions.summon({
                        conjuration: cardId
                    }),
                    getWarnings: (context) => {
                        if (!context.player.archives.some((c) => c.id === cardId)) {
                            return 'You don\'t have a conjuration to play'
                        }
                    }
                },
                properties
            )
        )
    }

    reaction(properties) {
        if (properties.play) {
            properties.when = {
                onCardPlayed: (event, context) => event.card === context.source
            };
        }

        return this.triggeredAbility(AbilityType.Reaction, properties);
    }

    forcedReaction(properties) {
        if (properties.play) {
            properties.when = {
                onCardPlayed: (event, context) => event.card === context.source
            };
        }

        return this.triggeredAbility(AbilityType.ForcedReaction, properties);
    }

    applyAnyLocationPersistentEffects() {
        _.each(this.persistentEffects, (effect) => {
            if (effect.location === 'any') {
                effect.ref = this.addEffectToEngine(effect);
            }
        });
    }

    onLeavesPlay() {
        this.moribund = false;
        this.new = false;
        this.tokens = {};
        this.setDefaultController(this.owner);
        this.endRound();
    }

    endRound() {
        this.usedGuardThisRound = false;
    }

    endTurn() {
        // this.doSomething ?
    }

    moveTo(targetLocation) {
        let originalLocation = this.location;

        this.location = targetLocation;

        if (
            [
                'play area',
                'spellboard',
                'discard',
                'hand',
                'purged',
                'grafted',
                'archives'
            ].includes(targetLocation)
        ) {
            this.facedown = false;
        }

        if (originalLocation !== targetLocation) {
            this.updateAbilityEvents(originalLocation, targetLocation);
            this.updateEffects(originalLocation, targetLocation);
            this.game.emitEvent('onCardMoved', {
                card: this,
                originalLocation: originalLocation,
                newLocation: targetLocation
            });
        }
    }

    getMenu() {
        var menu = [];

        if (
            !this.menu.length ||
            !this.game.manualMode ||
            (this.location !== 'play area' &&
                this.location !== 'spellboard' &&
                this.location !== 'hand' &&
                this.location !== 'discard' &&
                this.location !== 'archives')
        ) {
            return undefined;
        }

        if (this.facedown) {
            return [{ command: 'reveal', text: 'Reveal', menu: 'main' }];
        }

        menu.push({ command: 'click', text: 'Select card', menu: 'main' });
        menu.push({ command: 'inspect', text: 'Inspect card', menu: 'main' });
        if (this.dieUpgrades.length) {
            menu.push({ command: 'detachDie', text: 'Remove die', menu: 'main' });
        }
        if (UpgradeCardTypes.includes(this.type)) {
            if (!this.parent) {
                menu.push({ command: 'attach', text: 'Attach', menu: 'main' });
            } else {
                menu.push({ command: 'moveHand', text: 'Remove', menu: 'main' });

            }
        }
        if (
            this.location === 'play area' ||
            this.location === 'spellboard' ||
            this.location === 'hand' ||
            this.location === 'discard' ||
            this.location === 'archives'
        ) {
            menu = menu.concat(this.menu);
        }

        return menu;
    }

    getFlags() {
        var flags = {};
        if (this.location === 'play area' || this.location === 'spellboard') {
            const attack = this.getAttack();
            if (this.hasModifiedAttack()) flags.attack = attack;

            const life = this.getLife();
            if (this.hasModifiedLife()) flags.life = life;

            const recover = this.getRecover();
            if (this.hasModifiedRecover()) flags.recover = recover;

            const focus = this.focus;
            if (focus > 0) flags.spellfocus = focus;
        }
        return flags;
    }

    getAcquiredEffects() {
        const acquiredEffects = this.effects.filter(
            (e) => e.context.source != this || e.effect.printedAbility === false
        );
        const simpleTypes = {
            'preventAllDamage': 'Prevent all damage',
            'bypass': 'Bypass',
            'quickStrike': 'Quick strike',
            'cannotBeAttackTarget': 'Cannot be attack target',
            'cannotBeSpellTarget': 'Protected',
            'preventBlock': 'Cannot be blocked',
            'preventGuard': 'Cannot be guarded against'
        };
        const simpleNames = acquiredEffects
            .filter((e) => Object.keys(simpleTypes).includes(e.type))
            .map((e) => ({
                effect: e.type,
                source: e.context.source.name,
                name: simpleTypes[e.type]
            }));
        const keywords = acquiredEffects
            .filter((e) => e.type === 'addKeyword')
            .map((e) => {
                const value = Object.keys(e.getValue())[0];
                return { effect: value, source: value, name: value };
            });
        const restrictions = acquiredEffects
            .filter((e) => e.type === 'abilityRestrictions')
            .map((e) => ({
                effect: 'cannot' + e.value.type,
                source: e.context.source.name,
                name: 'Cannot ' + e.value.type
            }));

        // const gainedAbilities = acquiredEffects
        //     .filter((e) => e.type === 'gainAbility');
        return simpleNames.concat(keywords).concat(restrictions);
    }

    checkRestrictions(actionType, context = null) {
        return (
            super.checkRestrictions(actionType, context) &&
            (!context || !context.player || context.player.checkRestrictions(actionType, context))
        );
    }

    addToken(type, number = 1) {
        if (!number || !Number.isInteger(number)) {
            return;
        }

        if (_.isUndefined(this.tokens[type])) {
            this.tokens[type] = 0;
        }

        this.tokens[type] += number;
        if (this.tokens[type] <= 0) {
            this.tokens[type] = undefined;
        }
    }

    hasToken(type) {
        return !!this.tokens[type];
    }

    hasAnyTokens() {
        return Object.keys(this.tokens).length;
    }

    allTokenCount() {
        return !this.tokens
            ? 0
            : Object.keys(this.tokens)
                .map((key) => this.tokens[key])
                .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    removeAllTokens() {
        this.tokens = {};
    }

    removeToken(type, number = 1) {
        if (!this.tokens[type]) {
            return;
        }

        this.tokens[type] -= number;

        if (this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }

        if (this.tokens[type] === 0) {
            delete this.tokens[type];
        }
    }

    clearToken(type) {
        if (this.tokens[type]) {
            delete this.tokens[type];
        }
    }

    hasKeyword(keyword) {
        return !!this.getKeywordValue(keyword);
    }

    getKeywordValue(keyword) {
        keyword = keyword.toLowerCase();
        if (this.getEffects('removeKeyword').includes(keyword)) {
            return 0;
        }

        const value = this.getEffects('addKeyword').reduce(
            (total, keywords) => total + (keywords[keyword] ? keywords[keyword] : 0),
            0
        );
        const magnifier = value ? this.getMagnifier() : 0;

        return magnifier + value;
    }

    getMagnifier() {
        return this.getEffects('magnify').reduce((total, val) => total + val, 0);
    }

    exhaustsOnCounter() {
        return !this.anyEffect('alert');
    }

    createSnapshot() {
        let clone = new Card(this.owner, this.cardData);
        clone.upgrades = this.upgrades.map((upgrade) => upgrade.createSnapshot());
        // clone.dieUpgrades = this.dieUpgrades.map((die) => die.createSnapshot());
        clone.effects = _.clone(this.effects);
        clone.tokens = _.clone(this.tokens);
        clone.flags = _.clone(this.flags);
        clone.controller = this.controller;
        clone.location = this.location;
        clone.parent = this.parent;
        clone.modifiedAttack = this.getAttack();
        clone.modifiedLife = this.getLife();
        clone.modifiedBattlefield = this.getBattlefield();
        clone.modifiedSpellboard = this.getSpellboard();
        clone.modifiedRecover = this.getRecover();
        return clone;
    }

    get attack() {
        return this.getAttack();
    }

    get life() {
        return this.getLife();
    }

    get battlefield() {
        return this.getBattlefield();
    }

    get spellboard() {
        return this.getSpellboard();
    }

    get isSpell() {
        return this.type.includes('Spell');
    }

    getAttack(printed = false) {
        if (printed) {
            return this.printedAttack;
        }

        if (this.anyEffect('setAttack')) {
            return this.mostRecentEffect('setAttack');
        }

        const copyEffect = this.mostRecentEffect('copyCard');
        const printedAttackEffect = this.mostRecentEffect('setPrintedAttack');
        let printedAttack = copyEffect
            ? this.getCopyAttack(copyEffect)
            : printedAttackEffect || this.printedAttack;

        //if the printed value is X, use 0
        if (typeof printedAttack === 'string') {
            printedAttack = 0;
        }

        return Math.max(0, printedAttack + this.sumEffects('modifyAttack'));
    }

    hasModifiedAttack() {
        return (
            BattlefieldTypes.includes(this.type) &&
            (this.anyEffect('setAttack') ||
                this.anyEffect('copyCard') ||
                this.anyEffect('setPrintedAttack') ||
                this.anyEffect('modifyAttack'))
        );
    }

    getCopyAttack(copyEffect) {
        // use calculated value of attack - e.g. for SilverSnake X attack
        return typeof copyEffect.printedAttack === 'string'
            ? copyEffect.attack
            : copyEffect.getAttack(true);
    }

    getLife(printed = false) {
        if (printed) {
            return this.printedLife;
        }

        if (this.anyEffect('setLife')) {
            return this.mostRecentEffect('setLife');
        }

        const copyEffect = this.mostRecentEffect('copyCard');
        const printedLifeEffect = this.mostRecentEffect('setPrintedLife');
        let printedLife = copyEffect
            ? this.getCopyLife(copyEffect)
            : printedLifeEffect || this.printedLife;

        //if the printed value is X, use 0
        if (typeof printedLife === 'string') {
            printedLife = 0;
        }

        return Math.max(0, printedLife + this.sumEffects('modifyLife'));
    }

    hasModifiedLife() {
        return (
            BattlefieldTypes.includes(this.type) &&
            (this.anyEffect('setLife') ||
                this.anyEffect('copyCard') ||
                this.anyEffect('setPrintedLife') ||
                this.anyEffect('modifyLife'))
        );
    }

    getCopyLife(copyEffect) {
        // use calculated value of life if x
        return typeof copyEffect.printedLife === 'string'
            ? copyEffect.life
            : copyEffect.getLife(true);
    }

    get recover() {
        return this.getRecover();
    }

    getRecover(printed = false) {
        if (printed) {
            return this.printedRecover;
        }

        if (this.anyEffect('setRecover')) {
            return this.mostRecentEffect('setRecover');
        }

        const copyEffect = this.mostRecentEffect('copyCard');
        const printedRecoverEffect = this.mostRecentEffect('setPrintedRecover');
        let printedRecover = copyEffect
            ? copyEffect.recover
            : printedRecoverEffect || this.printedRecover;

        //if the printed value is X, use 0
        if (typeof printedRecover === 'string') {
            printedRecover = 0;
        }

        return Math.max(0, printedRecover + this.sumEffects('modifyRecover'));
    }

    hasModifiedRecover() {
        return (
            BattlefieldTypes.includes(this.type) &&
            (this.anyEffect('setRecover') ||
                this.anyEffect('copyCard') ||
                this.anyEffect('setPrintedRecover') ||
                this.anyEffect('modifyRecover'))
        );
    }

    getCopyRecover(copyEffect) {
        // use calculated value of Recover if x
        return typeof copyEffect.printedRecover === 'string'
            ? copyEffect.recover
            : copyEffect.getRecover(true);
    }

    getBattlefield(printed = false) {
        if (printed) {
            return this.printedBattlefield;
        }

        if (this.anyEffect('setBattlefield')) {
            return this.mostRecentEffect('setBattlefield');
        }

        const copyEffect = this.mostRecentEffect('copyCard');
        const printedBattlefield = copyEffect
            ? copyEffect.printedBattlefield
            : this.printedBattlefield;
        return printedBattlefield + this.sumEffects('modifyBattlefield');
    }

    getSpellboard(printed = false) {
        if (printed) {
            return this.printedSpellboard;
        }

        if (this.anyEffect('setSpellboard')) {
            return this.mostRecentEffect('setSpellboard');
        }

        const copyEffect = this.mostRecentEffect('copyCard');
        const printedSpellboard = copyEffect
            ? copyEffect.printedSpellboard
            : this.printedSpellboard;
        return printedSpellboard + this.sumEffects('modifySpellboard');
    }

    get armor() {
        return this.getArmor();
    }

    getArmor() {
        if (this.anyEffect('setArmor')) {
            return this.mostRecentEffect('setArmor');
        }

        return this.sumEffects('modifyArmor');
    }

    getBonusDamage(target) {
        let effects = this.getEffects('bonusDamage');
        return effects.reduce((total, match) => total + match(target), 0);
    }

    get status() {
        return this.hasToken('status') ? this.tokens.status : 0;
    }

    get exhaustion() {
        return this.hasToken('exhaustion') ? this.tokens.exhaustion : 0;
    }

    get exhaustionGravityFlux() {
        return this.hasToken('gravityFlux') ? this.tokens.gravityFlux : 0;
    }

    get exhausted() {
        return (
            this.hasToken('exhaustion') ||
            this.anyEffect('exhausted') ||
            this.hasToken('gravityFlux')
        );
    }

    get damage() {
        return this.hasToken('damage') ? this.tokens.damage : 0;
    }

    get redRains() {
        return this.hasToken('redRains') ? this.tokens.redRains : 0;
    }

    get ultimate() {
        return this.printedUltimate + this.exhaustion;
    }

    exhaust(amount = 1) {
        this.addToken('exhaustion', amount);
    }

    unExhaust() {
        this.clearToken('exhaustion');
    }

    exhaustGravityFlux() {
        this.addToken('gravityFlux');
    }

    unExhaustGravityFlux() {
        this.clearToken('gravityFlux');
    }

    ready() {
        this.removeToken('exhaustion');
    }

    removeAttachment(card) {
        this.upgrades = this.upgrades.filter((c) => c !== card);
    }

    removeDieAttachment(die) {
        this.dieUpgrades = this.dieUpgrades.filter((c) => c !== die);
    }

    get hasCharmDie() {
        return this.dieUpgrades.some((c) => c.magic === Magic.Charm);
    }

    canPlayAsUpgrade() {
        return this.anyEffect('canPlayAsUpgrade') || UpgradeCardTypes.includes(this.type);
    }

    canSpendDieUpgrades(context) {
        return false;
    }

    use(player) {
        let legalActions = this.getLegalActions(player);

        if (legalActions.length === 0) {
            return false;
        } else if (legalActions.length === 1) {
            let action = legalActions[0];
            if (!this.game.activePlayer.optionSettings.confirmOneClick) {
                let context = action.createContext(player);
                this.game.resolveAbility(context);
                return true;
            }
        }

        let choices = legalActions.map((action) => action.title);
        let handlers = legalActions.map((action) => () => {
            let context = action.createContext(player);
            this.game.resolveAbility(context);
        });

        choices = choices.concat('Cancel');
        handlers = handlers.concat([() => true]);

        this.game.promptWithHandlerMenu(player, {
            activePromptTitle:
                this.location === 'play area' || this.location === 'spellboard'
                    ? 'Choose an ability:'
                    : { text: 'Play {{card}}:', values: { card: this.name } },
            source: this,
            choices: choices,
            handlers: handlers
        });

        return true;
    }

    canAttack() {
        return !this.exhausted && this.checkRestrictions('attack');
    }

    attacksFirst() {
        return this.anyEffect('quickStrike');
    }

    get focus() {
        if (this.type !== CardType.ReadySpell || this.location !== 'spellboard') return 0;

        const focusLevel =
            this.owner.spellboard.filter((spell) => spell.cardSlot === this.id).length - 1;
        return Math.max(focusLevel, 0);
    }

    get cardSlot() {
        return this.actsAs || this.id;
    }

    alert() {
        this.persistentEffect({
            effect: AbilityDsl.effects.alert()
        });
    }

    spellGuard(properties = {}) {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.cannotBeSpellTarget(),
                AbilityDsl.effects.cannotBeAffectedBySpells()
            ],
            ...properties
        });
    }

    concealed(properties = { condition: () => !this.exhausted }) {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.cannotBeSpellTarget(),
                AbilityDsl.effects.cannotBeAbilityTarget(),
                AbilityDsl.effects.cannotBeDicePowerTarget(),
                AbilityDsl.effects.cannotBeAttackTarget()
            ],
            ...properties
        });
    }

    dismount() {
        return this.destroyed({
            inexhaustible: true,
            effect: 'return its ally to hand',
            gameAction: AbilityDsl.actions.sequentialForEach((context) => ({
                forEach: context.source.childCards,
                action: AbilityDsl.actions.moveCard({ destination: 'hand' })
            }))
        });
    }

    transform(properties) {
        const amt = this.getAbilityNumeric(properties.amount);
        return this.persistentEffect({
            condition: () => !this.controller.firstPlayer,
            match: this,
            effect: [
                AbilityDsl.effects.modifyAttack(amt),
                AbilityDsl.effects.modifyLife(amt),
                AbilityDsl.effects.modifyRecover(amt)
            ]
        });
    }

    tame(properties) {
        return this.persistentEffect({
            targetController: 'opponent',
            condition: (context) =>
                (context.source.isAttacker || context.source.isDefender) &&
                !context.source.exhausted,
            match: (card, context) =>
                BattlefieldTypes.includes(card.type) && // unit
                (card.isAttacker || card.isDefender) &&
                this.areBattling(card, context.source, context),
            effect: AbilityDsl.effects.modifyAttack(-this.getAbilityNumeric(properties.amount))
        });
    }

    getAbilityNumeric(input) {
        return input + this.getMagnifier();
    }

    areBattling(card, source, context) {
        return (
            context.game.attackState &&
            context.game.attackState.battles.some(
                (b) =>
                    (b.attacker === card && (b.target === source || b.guard === source)) ||
                    (b.attacker === source && (b.target === card || b.guard === card))
            )
        );
    }

    stalk() {
        this.persistentEffect({
            effect: AbilityDsl.effects.preventGuard()
        });
    }

    unitGuard() {
        this.persistentEffect({
            effect: AbilityDsl.effects.canGuard()
        });
    }

    bound() {
        this.persistentEffect({
            effect: AbilityDsl.effects.bound()
        });
    }

    fearful() {
        this.persistentEffect({
            title: 'Fearful',
            effect: AbilityDsl.effects.cardCannot('block')
        });
    }

    groupTactics(amount) {
        this.persistentEffect({
            effect: AbilityDsl.effects.addKeyword({ grouptactics: amount })
        });
    }

    canGuard(attacker) {
        // phoenixborn and not guarded this round
        // OR has Unit Guard keyword / ability.
        if (!this.checkRestrictions('guard')) return false;

        if (this.type == CardType.Phoenixborn) {
            return !this.usedGuardThisRound;
        } else {
            return (
                BattlefieldTypes.includes(this.type) &&
                !this.exhausted &&
                this.anyEffect('canGuard') &&
                this.checkGigantic(attacker) &&
                this.checkTerrifying(attacker) &&
                !attacker.anyEffect('bypass') &&
                !attacker.anyEffect('preventGuard')
            );
        }
    }

    canBlock(attacker) {
        if (!this.checkRestrictions('block')) return false;

        return (
            BattlefieldTypes.includes(this.type) &&
            !this.exhausted &&
            this.checkGigantic(attacker) &&
            this.checkTerrifying(attacker) &&
            !attacker.anyEffect('preventBlock') &&
            !attacker.anyEffect('bypass')
        );
    }

    checkGigantic(attacker) {
        // ok to block if attacker doesn't have gigantic, or gigantic value is less than this card's life value
        return !attacker.hasKeyword('gigantic') || attacker.getKeywordValue('gigantic') < this.life;
    }

    checkTerrifying(attacker) {
        // ok to block if attacker doesn't have terrifying, or terrifying value is less than this card's attack value
        return (
            !attacker.hasKeyword('terrifying') ||
            attacker.getKeywordValue('terrifying') < this.attack
        );
    }

    getLegalActions(player) {
        let actions = this.getActions();
        actions = actions.filter((action) => {
            let context = action.createContext(player);
            return !action.meetsRequirements(context);
        });

        return actions;
    }

    getActions(location = this.location) {
        let actions = [];
        if (location === 'hand') {
            if (this.type === 'Ally') {
                actions.push(new PlayAllyAction(this));
            } else if (this.type === 'Ready Spell') {
                actions.push(new PlayReadySpellAction(this));
            } else if (this.type === 'Action Spell') {
                actions.push(new PlayAction(this));
            }

            if (this.canPlayAsUpgrade()) {
                if (this.placement === 'Phoenixborn') {
                    actions.push(new PlayPbUpgradeAction(this));
                } else {
                    actions.push(new PlayUpgradeAction(this));
                }
            }
        }

        return actions.concat(this.actions.slice());
    }

    canPlay(activePlayer) {
        // fudge - the getLegalActions inside canPlay() destroys a PlayerAction target and properties when interrupted mid-resolution
        // see order of call in getState
        let isController = activePlayer === this.controller;

        return !!(
            activePlayer === this.game.activePlayer &&
            isController &&
            this.getLegalActions(activePlayer).length > 0
        )
    }

    getModifiedController() {
        if (this.location === 'play area' || this.location === 'spellboard') {
            return this.mostRecentEffect('takeControl') || this.defaultController;
        }

        return this.owner;
    }

    get isInPlay() {
        return PhoenixbornTypes.includes(this.type) || this.controller.unitsInPlay.includes(this);
    }

    isLimited() {
        return this.type === CardType.ReactionSpell;
    }

    getShortSummary() {
        let result = super.getShortSummary();

        // Include card specific information useful for UI rendering
        result.location = this.location;
        result.isChained = this.isChained;
        result.index = this.index;
        return result;
    }

    getSummary(activePlayer) {
        let selectionState = activePlayer.getCardSelectionState(this);

        if (!this.game.isCardVisible(this, activePlayer) && !this.game.isCardPublic(this)) {
            const result = {
                controller: this.controller.name,
                location: this.location,
                facedown: true,
                uuid: this.uuid,
                // tokens: this.tokens,
                // armor: this.armor,
                isConjuration: ConjuredCardTypes.includes(this.type),
                ...selectionState
            };
            if (this.blood) {
                result.blood = this.blood;
            }
            return result;
        }

        let state = {
            id: this.id,
            index: this.index,
            imageStub: this.getImageStub(),
            altArts: this.altArts,
            // FUDGE - Order matters here. The getLegalActions inside canPlay() destroys a PlayerAction target and properties when interrupted mid-resolution
            canPlay: (activePlayer.promptState.promptTitle === 'Play phase') && this.canPlay(activePlayer),
            childCards: this.childCards.map((card) => {
                return card.getSummary(activePlayer);
            }),
            controlled: this.owner !== this.controller,
            exhausted: this.exhausted,
            facedown: this.facedown,
            location: this.location,
            menu: this.getMenu(),
            name: this.name,
            cardSlot: this.cardSlot,
            label: this.name,
            new: this.new,
            type: this.getType(),
            upgrades: this.upgrades.map((upgrade) => {
                return upgrade.getSummary(activePlayer);
            }),
            dieUpgrades: this.dieUpgrades.map((die) => {
                return die.getSummary(activePlayer);
            }),
            tokens: this.tokens,
            flags: this.getFlags(),
            acquiredEffects: this.getAcquiredEffects(),
            armor: this.armor,
            life: this.life,
            guarded: this.usedGuardThisRound,
            uuid: this.uuid,
            isAttacker: this.isAttacker,
            isDefender: this.isDefender,
            isConjuration: ConjuredCardTypes.includes(this.type),
            isChained: this.isChained,
            altArts: this.altArts,
            conjurations: this.conjurations, //?? .map((c) => c.stub),
            phoenixborn: this.phoenixborn
        };

        return Object.assign(state, selectionState);
    }
}

module.exports = Card;
