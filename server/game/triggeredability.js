const _ = require('underscore');
const { CardType, AbilityType } = require('../constants.js');

const CardAbility = require('./CardAbility.js');
const TriggeredAbilityContext = require('./TriggeredAbilityContext.js');

/**
 * Represents a reaction/interrupt ability provided by card text.
 *
 * Properties:
 * when    - object whose keys are event names to listen to for the reaction and
 *           whose values are functions that return a boolean about whether to
 *           trigger the reaction when that event is fired. For example, to
 *           trigger only at the end of the challenge phase, you would do:
 *           when: {
 *               onPhaseEnded: event => event.phase === 'conflict'
 *           }
 *           Multiple events may be specified for cards that have multiple
 *           possible triggers for the same reaction.
 * title   - string which is displayed to the player to reference this ability
 * cost    - object or array of objects representing the cost required to be
 *           paid before the action will activate. See Costs.
 * target  - object giving properties for the target API
 * handler - function that will be executed if the player chooses 'Yes' when
 *           asked to trigger the reaction. If the reaction has more than one
 *           choice, use the choices sub object instead.
 * limit   - optional AbilityLimit object that represents the max number of uses
 *           for the reaction as well as when it resets.
 * max     - optional AbilityLimit object that represents the max number of
 *           times the ability by card title can be used. Contrast with `limit`
 *           which limits per individual card.
 * location - string or array of strings indicating the location the card should
 *            be in in order to activate the reaction. Defaults to 'play area'.
 */

class TriggeredAbility extends CardAbility {
    constructor(game, card, abilityType, properties) {
        super(game, card, properties);
        this.when = properties.when;
        this.title = properties.title;
        this.triggeredByOpponent = !!properties.triggeredByOpponent;
        this.autoResolve = !!properties.autoResolve;
        this.abilityType = abilityType;
        this.optional = !!properties.optional;
        this.hasTriggered = false;
        this.isLastingAbilityTrigger = !!properties.player;
        this.logUse = properties.logUse;
        this.status = properties.status;
        if (properties.location === 'any') {
            this.registerEvents();
        }
    }

    eventHandler(event, window) {
        let player = this.properties.player || this.card.controller;
        if (
            !this.isLastingAbilityTrigger &&
            event.name === 'onCardPlayed' &&
            this.card.type === 'action'
        ) {
            player = event.player;
        } else if (this.triggeredByOpponent) {
            player = player.opponent;
        }

        if (!player) {
            return;
        }

        let context = this.createContext(player, event);
        // console.log(event.name, this.card.name, this.isTriggeredByEvent(event, context), this.meetsRequirements(context));
        if (
            this.card.reactions.includes(this) ||
            (this.isLastingAbilityTrigger &&
                (!this.hasTriggered || this.properties.multipleTrigger))
        ) {
            if (this.isTriggeredByEvent(event, context) && this.meetsRequirements(context) === '') {
                window.addChoice(context);
            }
        }
    }

    createContext(player = this.card.controller, event) {
        return new TriggeredAbilityContext({
            event: event,
            game: this.game,
            source: this.card,
            player: player,
            ability: this
        });
    }

    isTriggeredByEvent(event, context) {
        // exhausted cards don't trigger abilities (unless inexhaustible)
        if (this.card.exhausted && !this.properties.inexhaustible) {
            return false;
        }
        // abilities with conditions need to have those met
        if (this.properties.condition && !this.properties.condition(context)) {
            // this seems like a duplication of 'when'...?
            return false;
        }
        // check 'when' clause to ensure that is met
        if (!this.when[event.name] || !this.when[event.name](event, context)) {
            return false;
        }

        if (this.properties.play) {
            if (event.name === 'onCardPlayed' && !this.isPlay()) {
                return false;
            }
        }

        if (this.properties.isLimited && !this.card.controller.canPlayLimited()) {
            return false;
        }

        return true;
    }

    isPlay() {
        return this.properties.play;
    }

    registerEvents() {
        if (this.events) {
            return;
        }

        var eventNames = _.keys(this.when);
        this.events = [];
        _.each(eventNames, (eventName) => {
            var event = {
                name: eventName + ':' + this.abilityType,
                handler: (event, window) => this.eventHandler(event, window)
            };
            this.game.on(event.name, event.handler);
            this.events.push(event);
        });
    }

    unregisterEvents() {
        if (this.events) {
            _.each(this.events, (event) => {
                this.game.removeListener(event.name, event.handler);
            });
            this.events = null;
        }
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let canPlayerTrigger =
            this.anyPlayer ||
            context.player === this.card.controller ||
            this.card.anyEffect('canBeTriggeredByOpponent');

        if (!ignoredRequirements.includes('player') && !canPlayerTrigger) {
            if (
                this.card.type !== CardType.ReactionSpell ||
                !context.player.isCardInPlayableLocation(this.card, context.playType)
            ) {
                return 'player';
            }
        }

        // can this card be played as a reaction spell
        if (this.isCardPlayed() && !context.player.checkRestrictions('play', context)) {
            return 'cannotPlay';
        }

        // no reactions out of playerturns phase
        if (
            (this.card.type === CardType.ReactionSpell ||
                this.abilityType === AbilityType.Reaction) &&
            context.game.currentPhase !== 'playerturns'
        ) {
            return 'phase';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }
}

module.exports = TriggeredAbility;
