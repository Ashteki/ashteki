const { CardType } = require('../../constants');
const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability.js');
const { Costs } = require('../costs');

class RevealAct extends BaseAbility {
    constructor(card, costs = [], target) {
        const revealCost = Costs.mainAction();
        let properties = { cost: costs.concat([revealCost]) };
        if (target) {
            properties.target = target;
        }

        super(properties);
        this.card = card;
        this.abilityType = 'action';
    }

    displayMessage(context) {
        if (![CardType.ReactionSpell, CardType.ActionSpell].includes(context.source.type)) {
            context.game.addMessage('{0} reveals {1}', context.player, context.source);
        }
    }

    // meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
    //     if (
    //         !ignoredRequirements.includes('location') &&
    //         !context.player.isCardInPlayableLocation(context.source, 'play')
    //     ) {
    //         return 'location';
    //     } else if (
    //         !ignoredRequirements.includes('cannotTrigger') &&
    //         (!context.player.checkRestrictions('play', context) ||
    //             !context.source.checkRestrictions('play', context))
    //     ) {
    //         return 'cannotTrigger';
    //     }

    //     if (this.isCardPlayed() && this.card.isLimited() && !context.player.canPlayLimited()) {
    //         return 'limited';
    //     }

    //     return super.meetsRequirements(context, ignoredRequirements);
    // }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card
        });
    }

    addSubEvent(event, context) {
        let action = context.game.actions.putIntoPlay({ target: context.card });
        event.addChildEvent(action.getEvent(context.source, context));
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
            () => context.game.cardsPlayed.push(event.card)
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

module.exports = RevealAct;
