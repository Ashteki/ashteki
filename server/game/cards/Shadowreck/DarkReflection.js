const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class DarkReflection extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Slay 2',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                promptTitle: 'Choose a target unit to deal damage to',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage(() => ({
                    amount: this.getAbilityNumeric(2),
                    showMessage: true
                }))
            }
        });

        //TODO: war within
        this.destroyed({
            title: 'War Within',
            inexhaustible: true,
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.dice.some(d => !d.exhausted),
                trueGameAction: ability.actions.exhaustDie({
                    promptForSelect: {
                        mode: 'exactly',
                        numDice: 1,
                        dieCondition: (die) => !die.exhausted,
                        owner: 'self',
                        gameAction: ability.actions.exhaustDie()
                    }
                }),
                falseGameAction: ability.actions.addDamageToken((context) => ({
                    target: context.player.phoenixborn,
                    amount: 2
                }))
            })
        });
    }
}

DarkReflection.id = 'dark-reflection';

module.exports = DarkReflection;
