const { Magic, Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class MaeveLuminvale extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Power Split',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Artifice)])
            ],
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

MaeveLuminvale.id = 'maeve-luminvale';

module.exports = MaeveLuminvale;
