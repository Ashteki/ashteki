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
    Magic
} = require('../constants.js');
const PlayableObject = require('./PlayableObject.js');
const { parseCosts } = require('./costs.js');

class Card extends PlayableObject {
    constructor(owner, cardData) {
        super(owner.game);
        this.owner = owner;
        this.setDefaultController(owner);

        this.cardData = cardData;

        this.id = cardData.stub;
        this.printedName = cardData.name;
        this.image = cardData.image;
        this.printedType = cardData.type;

        this.playCost = cardData.cost ? parseCosts(cardData.cost) : [];
        this.magicCost = this.getMagicCost(cardData);
        this.conjurations = cardData.conjurations || [];

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
        this.clonedNeighbors = null;

        this.printedAttack = cardData.attack
            ? typeof cardData.attack === 'string'
                ? 0
                : cardData.attack
            : 0;
        this.printedLife = cardData.life
            ? typeof cardData.life === 'string'
                ? 0
                : cardData.life
            : 0;
        this.printedRecover = cardData.recover
            ? typeof cardData.recover === 'string'
                ? 0
                : cardData.recover
            : 0;
        this.printedBattlefield = cardData.battlefield;
        this.printedSpellboard = cardData.spellboard;

        this.moribund = false;
        // this.isFighting = false;

        this.locale = cardData.locale;

        this.menu = [
            { command: 'tokens', text: 'Modify Tokens', menu: 'main' },
            { command: 'main', text: 'Back', menu: 'tokens' },
            { command: 'addExhaustion', text: 'Add 1 exhaustion', menu: 'tokens' },
            { command: 'remExhaustion', text: 'Remove 1 exhaustion', menu: 'tokens' },
            { command: 'addDamage', text: 'Add 1 damage', menu: 'tokens' },
            { command: 'remDamage', text: 'Remove 1 damage', menu: 'tokens' },
            { command: 'addStatus', text: 'Add 1 status', menu: 'tokens' },
            { command: 'remStatus', text: 'Remove 1 status', menu: 'tokens' }
        ];
        if (this.type === CardType.Phoenixborn) {
            this.menu.push({ command: 'guarded', text: 'toggle guarded', menu: 'main' });
        } else {
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
    setupCardAbilities(ability) {}

    // eslint-disable-next-line no-unused-vars
    setupKeywordAbilities(ability) {
        // Overkill
        this.abilities.keywordReactions.push(
            this.afterDestroysFighting({
                autoResolve: true,
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.source.getKeywordValue('overkill'),
                    target: context.player.opponent.phoenixborn
                }))
            })
        );

        // // Hazardous
        // this.abilities.keywordReactions.push(
        //     this.interrupt({
        //         title: 'Hazardous',
        //         printedAbility: false,
        //         when: {
        //             onFight: (event, context) => event.card === context.source
        //         },
        //         gameAction: ability.actions.dealDamage((context) => ({
        //             amount: context.source.getKeywordValue('hazardous'),
        //             target: context.event.attacker,
        //             damageSource: context.source,
        //             damageType: 'hazardous'
        //         }))
        //     })
        // );
        // // Taunt
        // this.abilities.keywordPersistentEffects.push(
        //     this.persistentEffect({
        //         condition: () => !!this.getKeywordValue('taunt') && this.type === 'Ally',
        //         printedAbility: false,
        //         match: (card) => this.neighbors.includes(card) && !card.getKeywordValue('taunt'),
        //         effect: ability.effects.cardCannot('attackDueToTaunt')
        //     })
        // );
    }

    /**
     * @typedef {('play area'|'discard'|'archives'|'being played'|'draw')} CardLocation
     */

    /**
     * @typedef PlayProperties
     * @property {CardLocation} location The location this effect can trigger from
     * @property {function(any): boolean} condition An expression that returns whether this effect is allowed to trigger
     * @property {string} effect The text added to the game log when this effect triggers
     * @property {function(any): [any]} effectArgs A function that returns the arguments to the effect string
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
            effect: 'deal ' + amount + ' damage to a target phoenixborn',
            gameAction: AbilityDsl.actions.dealDamage((context) => ({
                target: context.player.opponent.phoenixborn
            }))
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

    groupTactics(properties) {
        return this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.battles.length >= 3
                    );
                }
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                target: this,
                effect: AbilityDsl.effects.modifyAttack(properties.amount),
                duration: 'untilEndOfTurn'
            })),
            effect: 'increase its attack value by ' + properties.amount
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

    inheritance() {
        return this.destroyed({
            title: 'Inheritance 1',
            inexhaustible: true,
            target: {
                optional: true,
                activePromptTitle: 'Inheritance 1',
                cardType: BattlefieldTypes,
                cardCondition: (card, context) => card !== context.source,
                gameAction: AbilityDsl.actions.addStatusToken()
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

    omni(properties) {
        properties.omni = true;
        return this.action(properties);
    }

    action(properties) {
        const action = new CardAction(this.game, this, properties);
        if (action.printedAbility) {
            this.abilities.actions.push(action);
        }

        return action;
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
        this.elusiveUsed = false;
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
            (this.location !== 'play area' && this.location !== 'spellboard')
        ) {
            return undefined;
        }

        if (this.facedown) {
            return [{ command: 'reveal', text: 'Reveal', menu: 'main' }];
        }

        menu.push({ command: 'click', text: 'Select Card', menu: 'main' });
        if (this.dieUpgrades.length) {
            menu.push({ command: 'detachDie', text: 'Remove Die', menu: 'main' });
        }
        if (UpgradeCardTypes.includes(this.type)) {
            menu.push({ command: 'attach', text: 'Attach', menu: 'main' });
        }
        if (this.location === 'play area' || this.location === 'spellboard') {
            menu = menu.concat(this.menu);
        }

        return menu;
    }

    getFlags() {
        var flags = {};
        if (this.location === 'play area' || this.location === 'spellboard') {
            const attack = this.getAttack();
            if (this.printedAttack !== attack) flags.attack = attack;

            const life = this.getLife();
            if (this.printedLife !== life) flags.life = life;

            const recover = this.getRecover();
            if (this.printedRecover !== recover) flags.recover = recover;

            const focus = this.focus;
            if (focus > 0) flags.spellfocus = focus;
        }
        return flags;
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

    readiesDuringReadyPhase() {
        return !this.anyEffect('doesNotReady');
    }

    hasKeyword(keyword) {
        return !!this.getKeywordValue(keyword);
    }

    getKeywordValue(keyword) {
        keyword = keyword.toLowerCase();
        if (this.getEffects('removeKeyword').includes(keyword)) {
            return 0;
        }

        return this.getEffects('addKeyword').reduce(
            (total, keywords) => total + (keywords[keyword] ? keywords[keyword] : 0),
            0
        );
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
        clone.clonedNeighbors = this.neighbors;
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
        const printedAttack = copyEffect
            ? copyEffect.attack // use calculated value of attack - e.g. for SilverSnake X attack
            : printedAttackEffect || this.printedAttack;
        return Math.max(0, printedAttack + this.sumEffects('modifyAttack'));
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
        const printedLife = copyEffect ? copyEffect.life : printedLifeEffect || this.printedLife;
        return Math.max(0, printedLife + this.sumEffects('modifyLife'));
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
        const printedRecover = copyEffect
            ? copyEffect.recover
            : printedRecoverEffect || this.printedRecover;

        return Math.max(0, printedRecover + this.sumEffects('modifyRecover'));
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

    get warded() {
        return this.hasToken('ward');
    }

    get exhaustion() {
        return this.hasToken('exhaustion') ? this.tokens.exhaustion : 0;
    }

    get exhausted() {
        return this.hasToken('exhaustion') || this.anyEffect('exhausted');
    }

    get damage() {
        return this.hasToken('damage') ? this.tokens.damage : 0;
    }

    exhaust() {
        this.addToken('exhaustion');
    }

    unExhaust() {
        this.clearToken('exhaustion');
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
        return this.persistentEffect({
            condition: () => !this.controller.firstPlayer,
            match: this,
            effect: [
                AbilityDsl.effects.modifyAttack(properties.amount),
                AbilityDsl.effects.modifyLife(properties.amount),
                AbilityDsl.effects.modifyRecover(properties.amount)
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
            effect: AbilityDsl.effects.modifyAttack(-properties.amount)
        });
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
                actions.push(new PlayUpgradeAction(this));
            }
        }

        return actions.concat(this.actions.slice());
    }

    getModifiedController() {
        if (this.location === 'play area' || this.location === 'spellboard') {
            return this.mostRecentEffect('takeControl') || this.defaultController;
        }

        return this.owner;
    }

    isOnFlank(flank) {
        if (this.type !== 'Ally') {
            return false;
        }

        let position = this.controller.unitsInPlay.indexOf(this);
        if (flank === 'left') {
            return (
                (this.anyEffect('consideredAsFlank') || this.neighbors.length < 2) && position === 0
            );
        } else if (flank === 'right') {
            return (
                (this.anyEffect('consideredAsFlank') || this.neighbors.length < 2) &&
                position === this.controller.unitsInPlay.length - 1
            );
        }

        return this.anyEffect('consideredAsFlank') || this.neighbors.length < 2;
    }

    isInCenter() {
        let creatures = this.controller.unitsInPlay;
        if (creatures.length % 2 === 0) {
            return false;
        }

        let mid = Math.floor(creatures.length / 2);
        let centerCreature = creatures[mid];

        return this === centerCreature;
    }

    get isInPlay() {
        return this.type === CardType.Phoenixborn || this.controller.unitsInPlay.includes(this);
    }

    get neighbors() {
        if (this.type !== 'Ally') {
            return [];
        } else if (this.clonedNeighbors) {
            return this.clonedNeighbors;
        }

        let creatures = this.controller.unitsInPlay;
        let index = creatures.indexOf(this);
        let neighbors = [];

        if (index < 0) {
            return neighbors;
        } else if (index > 0) {
            neighbors.push(creatures[index - 1]);
        }

        if (index < creatures.length - 1) {
            neighbors.push(creatures[index + 1]);
        }

        return neighbors;
    }

    isLimited() {
        return this.type === CardType.ReactionSpell;
    }

    getShortSummary() {
        let result = super.getShortSummary();

        // Include card specific information useful for UI rendering
        result.locale = this.locale;
        result.location = this.location;
        return result;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let isController = activePlayer === this.controller;
        let selectionState = activePlayer.getCardSelectionState(this);

        if (!this.game.isCardVisible(this, activePlayer)) {
            return {
                cardback: this.owner.deckData.cardback,
                controller: this.controller.name,
                location: this.location,
                facedown: true,
                uuid: this.uuid,
                tokens: this.tokens,
                flags: this.getFlags(),
                armor: this.armor,
                isConjuration: ConjuredCardTypes.includes(this.type),
                ...selectionState
            };
        }

        let state = {
            id: this.id,
            image: this.image,
            canPlay: !!(
                activePlayer === this.game.activePlayer &&
                isController &&
                //TODO: this is a bit of a fudge - the getLegalActions destroys a PlayerAction target
                // and properties when interrupted mid-resolution
                activePlayer.promptState.promptTitle === 'Play phase' &&
                this.getLegalActions(activePlayer).length > 0
            ),
            cardback: this.owner.deckData.cardback,
            childCards: this.childCards.map((card) => {
                return card.getSummary(activePlayer, hideWhenFaceup);
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
            tokens: this.tokens,
            type: this.getType(),
            upgrades: this.upgrades.map((upgrade) => {
                return upgrade.getSummary(activePlayer, hideWhenFaceup);
            }),
            dieUpgrades: this.dieUpgrades.map((die) => {
                return die.getSummary(activePlayer);
            }),
            flags: this.getFlags(),
            armor: this.armor,
            guarded: this.usedGuardThisRound,
            cannotBlock: !this.checkRestrictions('block'),
            uuid: this.uuid,
            isAttacker: this.isAttacker,
            isDefender: this.isDefender,
            isConjuration: ConjuredCardTypes.includes(this.type),
            conjurations: this.conjurations //?? .map((c) => c.stub)
        };

        return Object.assign(state, selectionState);
    }
}

module.exports = Card;
