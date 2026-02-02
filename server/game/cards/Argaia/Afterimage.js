const Card = require('../../Card.js');
const { BattlefieldTypes, CardType } = require('../../../constants.js');

class Afterimage extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardLeavesPlay: (event, context) =>
                    event.triggeringEvent &&
                    event.triggeringEvent.name === 'onCardDestroyed' &&
                    event.triggeringEvent.clone.controller == context.player && // it's mine
                    CardType.Ally === event.triggeringEvent.card.type &&  // it's an ally
                    event.triggeringEvent.context.player === context.player.opponent
            },
            effect: "return {1} to hand, and deal 2 damage to an opponent's unit",
            effectArgs: (context) => [context.event.card],
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                destination: 'hand',
                cancel: false
            })),
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: "Select a unit to deal 2 damage to",
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage({ amount: 2, showMessage: true })
                }
            }
        });
    }
}

Afterimage.id = 'afterimage';

module.exports = Afterimage;
