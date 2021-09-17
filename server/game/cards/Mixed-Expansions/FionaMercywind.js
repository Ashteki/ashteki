const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class FionaMercywind extends Card {
    setupCardAbilities(ability) {
        return this.action({
            title: 'Ingenuity',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.chosenDiscard()
            ],
            gameAction: ability.actions.chooseAction((context) => ({
                choices: {
                    Draw: ability.actions.draw({
                        target: context.player,
                        showMessage: true
                    }),
                    'Remove exhaustion': ability.actions.removeExhaustion({
                        promptForSelect: {
                            controller: 'self',
                            cardType: CardType.ReadySpell,
                            cardCondition: (card) => card.exhausted
                        },
                        showMessage: true
                    })
                } //,
                //messages: {
                //    Draw: '{0} chooses to draw 1 card',
                //    'Remove exhaustion': '{0} chooses to remove an exhaustion token' // No target yet at the point of choosing, so can't just use {1}
                //}
            }))
        });
    }
}

FionaMercywind.id = 'fiona-mercywind';

module.exports = FionaMercywind;
