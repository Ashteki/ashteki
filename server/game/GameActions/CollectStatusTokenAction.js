const GameAction = require('./GameAction');
const CardSelector = require('../CardSelector.js');
const CollectTokenPrompt = require('../gamesteps/CollectTokenPrompt');

class CollectStatusTokenAction extends GameAction {
    setDefaultProperties() {
        this.cardCondition = () => true;
        this.controller = 'any';
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        this.events = [];

        context.game.queueStep(
            new CollectTokenPrompt(context.game, {
                choosingPlayer: this.choosingPlayer,
                selector: this.getSelector(),
                context: context,
                // onSelect: (cardDamage) => {
                //     for (const uuid of Object.keys(cardDamage)) {
                //         const card = context.game.findAnyCardInPlayByUuid(uuid);
                //         const amount = cardDamage[uuid].damage || 0;
                //         if (card) {
                //             // this.events.push(
                //             //     context.game.actions
                //             //         .dealDamage({ amount: amount })
                //             //         .getEvent(card, context)
                //             // );
                //         }
                //     }
                // }
            })
        );

    }

    getSelector() {
        return CardSelector.for({
            cardType: this.cardType,
            cardCondition: this.cardCondition,
            controller: this.controller
        });
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.getSelector().hasEnoughTargets(context);
    }

    getEventArray() {
        return this.events;
    }
}

module.exports = CollectStatusTokenAction;
