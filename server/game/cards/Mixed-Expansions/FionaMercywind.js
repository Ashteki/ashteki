const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const { Costs } = require('../../costs.js');

class FionaMercywind extends Card {
    setupCardAbilities(ability) {
        return this.action({
            title: 'Ingenuity',
            cost: [Costs.sideAction(), Costs.exhaust(), Costs.chosenDiscard()],
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
