const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Fear extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                first: {
                    player: 'self',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.sequential([
                        ability.actions.destroy(),
                        ability.actions.removeDamage((context) => ({
                            amount: context.targets.first.recover,
                            target: context.source.owner.Phoenixborn
                        }))
                    ])
                },
                second: {
                    dependsOn: 'first',
                    controller: 'opponent',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.discard()
                }
            }
        });
    }
}

Fear.id = 'fear';

module.exports = Fear;
