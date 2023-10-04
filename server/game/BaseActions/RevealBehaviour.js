const { CardType } = require('../../constants');
const AbilityContext = require('../AbilityContext');
const AbilityDsl = require('../abilitydsl');
const BaseAbility = require('../baseability.js');
const { Costs } = require('../costs');

class RevealBehaviour extends BaseAbility {
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
        context.game.addMessage('{0} reveals {1}', context.player, context.source);
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card
        });
    }

    addSubEvent(event, context) {
        let action = context.game.actions.revealAspect();
        const playEvent = action.getEvent(context.source, context);
        if (context.source.statusCount) {
            const tokenAction = AbilityDsl.actions.addStatusToken({ amount: context.source.statusCount, target: context.card });
            playEvent.addSubEvent(tokenAction.getEvent(context.source, context));
        }
        event.addChildEvent(playEvent);
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

module.exports = RevealBehaviour;
