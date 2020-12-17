const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class RinNorthfell extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ice Buff',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            targets: {
                unit: {
                    cardType: BattlefieldTypes,
                    controller: 'self'
                },
                conj: {
                    dependsOn: 'unit',
                    player: 'self',
                    cardType: CardType.ConjuredAlteration,
                    cardCondition: (card) => card.id === 'ice-buff',
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

RinNorthfell.id = 'rin-northfell';

module.exports = RinNorthfell;
