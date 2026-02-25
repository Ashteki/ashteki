const { CardType, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class CoreSupplier extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Supply 2',
            target: {
                toSelect: 'die',
                autoTarget: (context) =>
                    context.player.findDie((die) => die.magic === Magic.Artifice && die.exhausted),
                gameAction: ability.actions.resolveDieAbility()
            },
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

CoreSupplier.id = 'core-supplier';

module.exports = CoreSupplier;
