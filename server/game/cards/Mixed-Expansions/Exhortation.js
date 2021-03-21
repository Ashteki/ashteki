const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Exhortation extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                myUnit: {
                    activePromptTitle: 'Choose a Unit',
                    cardType: BattlefieldTypes,
                    controller: 'self'
                },
                myOther: {
                    dependsOn: 'myUnit',
                    activePromptTitle: 'Choose another unit',
                    cardType: BattlefieldTypes,
                    controller: 'self',
                    gameAction: [
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.targets.myOther,
                            duration: 'untilEndOfTurn',
                            effect: ability.effects.modifyAttack(context.targets.myUnit.attack)
                        })),
                        ability.actions.cardLastingEffect((context) => ({
                            target: context.targets.myUnit,
                            duration: 'untilEndOfTurn',
                            effect: ability.effects.modifyAttack(context.targets.myOther.attack)
                        }))
                    ]
                }
            }
        });
    }
}

Exhortation.id = 'exhortation';

module.exports = Exhortation;
