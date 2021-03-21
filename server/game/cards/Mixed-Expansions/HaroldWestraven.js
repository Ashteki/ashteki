const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class HaroldWestraven extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Mark Prey',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            targets: {
                unit: {
                    cardType: BattlefieldTypes
                },
                conj: {
                    dependsOn: 'unit',
                    controller: 'self',
                    cardType: CardType.ConjuredAlteration,
                    cardCondition: (card) => card.id === 'hunters-mark',
                    location: 'archives',
                    gameAction: ability.actions.attach((context) => ({
                        upgrade: context.targets.conj,
                        target: context.targets.unit
                    }))
                }
            }
        });
    }
}

HaroldWestraven.id = 'harold-westraven';

module.exports = HaroldWestraven;
