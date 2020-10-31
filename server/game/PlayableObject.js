const _ = require('underscore');
const { BattlefieldTypes, CardType } = require('../constants');
const EffectSource = require('./EffectSource');
const TriggeredAbility = require('./triggeredability');

class PlayableObject extends EffectSource {
    constructor(game) {
        super(game);
        this.copyEffect = 'copyCard';
        this.parent = null;

        this.abilities = {
            actions: [],
            reactions: [],
            persistentEffects: [],
            keywordReactions: [],
            keywordPersistentEffects: []
        };
    }

    isBlank() {
        return this.anyEffect('blank');
    }

    get persistentEffects() {
        return this.getPersistentEffects();
    }

    getPersistentEffects(ignoreBlank = false) {
        if (this.isBlank() && !ignoreBlank) {
            return this.abilities.keywordPersistentEffects;
        }

        let persistentEffects = this.abilities.persistentEffects;
        if (this.anyEffect(this.copyEffect)) {
            let mostRecentEffect = _.last(
                this.effects.filter((effect) => effect.type === this.copyEffect)
            );
            persistentEffects = mostRecentEffect.value.getPersistentEffects(this);
        }

        let gainedPersistentEffects = this.getEffects('gainAbility').filter(
            (ability) => ability.abilityType === 'persistentEffect'
        );
        return persistentEffects.concat(
            this.abilities.keywordPersistentEffects,
            gainedPersistentEffects
        );
    }

    updateAbilityEvents(from, to) {
        _.each(this.getReactions(true), (reaction) => {
            if (this.type === CardType.ReactionSpell) {
                if (
                    to === 'deck' ||
                    this.controller.isCardInPlayableLocation(this) ||
                    (this.controller.opponent &&
                        this.controller.opponent.isCardInPlayableLocation(this))
                ) {
                    reaction.registerEvents();
                } else {
                    reaction.unregisterEvents();
                }
            }
            if (reaction.location.includes(to) && !reaction.location.includes(from)) {
                reaction.registerEvents();
            } else if (!reaction.location.includes(to) && reaction.location.includes(from)) {
                reaction.unregisterEvents();
            }
        });
    }

    get reactions() {
        return this.getReactions();
    }

    getReactions(ignoreBlank = false) {
        if (this.isBlank() && !ignoreBlank) {
            return this.abilities.keywordReactions;
        }

        const TriggeredAbilityTypes = ['interrupt', 'reaction'];
        let reactions = this.abilities.reactions;
        if (this.anyEffect(this.copyEffect)) {
            let mostRecentEffect = _.last(
                this.effects.filter((effect) => effect.type === this.copyEffect)
            );
            reactions = mostRecentEffect.value.getReactions(this);
        }

        let effectReactions = this.getEffects('gainAbility').filter((ability) =>
            TriggeredAbilityTypes.includes(ability.abilityType)
        );
        return reactions.concat(this.abilities.keywordReactions, effectReactions);
    }

    /**
     * Applies an effect that continues as long as the playableObject providing the effect
     * is both in play and not blank.
     */
    persistentEffect(properties) {
        const allowedLocations = ['any', 'play area'];
        let location = properties.location || 'play area';
        if (!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }

        let ability = _.extend(
            {
                abilityType: 'persistentEffect',
                duration: 'persistentEffect',
                location: location,
                printedAbility: true
            },
            properties
        );
        if (ability.printedAbility) {
            this.abilities.persistentEffects.push(ability);
        }

        return ability;
    }

    updateEffects(from = '', to = '') {
        if (from === 'play area' || from === 'being played') {
            this.removeLastingEffects();
        }

        _.each(this.getPersistentEffects(true), (effect) => {
            if (effect.location !== 'any') {
                if (to === 'play area' && from !== 'play area') {
                    effect.ref = this.addEffectToEngine(effect);
                } else if (to !== 'play area' && from === 'play area') {
                    this.removeEffectFromEngine(effect.ref);
                    effect.ref = [];
                }
            }
        });
    }

    updateEffectContexts() {
        for (const effect of this.getPersistentEffects(true)) {
            if (effect.ref) {
                for (let e of effect.ref) {
                    e.refreshContext();
                }
            }
        }
    }

    /**
     * Applies an effect with the specified properties while the current card is
     * attached to another card. By default the effect will target the parent
     * card, but you can provide a match function to narrow down whether the
     * effect is applied (for cases where the effect only applies to specific
     * characters).
     */
    whileAttached(properties) {
        this.persistentEffect({
            condition: properties.condition || (() => true),
            match: (card, context) =>
                card === this.parent && (!properties.match || properties.match(card, context)),
            targetController: 'any',
            effect: properties.effect
        });
    }

    interrupt(properties) {
        return this.triggeredAbility('interrupt', properties);
    }

    triggeredAbility(abilityType, properties) {
        const ability = new TriggeredAbility(this.game, this, abilityType, properties);
        if (ability.printedAbility) {
            this.abilities.reactions.push(ability);
        }

        return ability;
    }

    /**
     * Checks whether the passed card meets the upgrade restrictions (e.g.
     * Opponent cards only etc) for this card.
     */
    // eslint-disable-next-line no-unused-vars
    canAttach(card, context) {
        return card && BattlefieldTypes.includes(card.getType()) && this.canPlayAsUpgrade();
    }

    canPlayAsUpgrade() {
        return false;
    }
}

module.exports = PlayableObject;
