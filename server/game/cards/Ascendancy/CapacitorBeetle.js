const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class CapacitorBeetle extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Volt Shift',
            inexhaustible: true,
            cost: ability.costs.sideAction(),
            gameAction: ability.actions.discard(),
            then: {
                target: {
                    toSelect: 'die',
                    autoTarget: (context) =>
                        context.player.findDie(
                            (die) => die.magic === Magic.Artifice && die.exhausted
                        ),
                    gameAction: ability.actions.resolveDieAbility()
                }
            }
        });
    }
}

CapacitorBeetle.id = 'capacitor-beetle';

module.exports = CapacitorBeetle;
