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
                        target: context.player
                    }),
                    'Remove exhaustion': ability.actions.removeExhaustion({
                        promptForSelect: {
                            controller: 'self',
                            cardType: CardType.ReadySpell,
                            cardCondition: (card) => card.exhausted
                        }
                    })
                }
            }))
        });
    }
}

FionaMercywind.id = 'fiona-mercywind';

module.exports = FionaMercywind;
