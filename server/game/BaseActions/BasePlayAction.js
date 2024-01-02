const { CardType } = require('../../constants');
const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability.js');

class BasePlayAction extends BaseAbility {
    constructor(card, target) {
        let properties = { cost: [].concat(card.playCost) };
        if (target) {
            properties.target = target;
        }

        super(properties);
        this.card = card;
        this.abilityType = 'action';
    }

    displayMessage(context) {
        if (![CardType.ReactionSpell].includes(context.source.type)) {
            if (context.costs.returnDice?.length) {
                context.game.addMessage(
                    '{0}{1}: {2} plays {3}',
                    context.costs.actions,
                    context.costs.returnDice,
                    context.player,
                    context.source
                );
            } else {
                context.game.addMessage(
                    '{0}{1} plays {2}',
                    context.costs.actions,
                    context.player,
                    context.source
                );
            }
        }
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if (
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(context.source, 'play')
        ) {
            return 'location';
        } else if (
            !ignoredRequirements.includes('cannotTrigger') &&
            (!context.player.checkRestrictions('play', context) ||
                !context.source.checkRestrictions('play', context))
        ) {
            return 'cannotTrigger';
        }

        if (this.isCardPlayed() && this.card.isLimited() && !context.player.canPlayLimited()) {
            return 'limited';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card
        });
    }

    // eslint-disable-next-line no-unused-vars
    addSubEvent(event, context) {
        return;
    }

    executeHandler(context) {
        this.displayMessage(context);
        let event = context.game.getEvent(
            'onCardPlayed',
            {
                player: context.player,
                card: context.source,
                originalLocation: context.source.location,
                context: context
            },
            () => context.game.cardPlayed(event.card, event.player)
        );
        this.addSubEvent(event, context);
        context.game.openEventWindow(event);
    }

    isAction() {
        return true;
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = BasePlayAction;
