const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class MemoryTheft extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Memory Theft',
            location: 'spellboard',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Charm)])
            ],
            target: {
                controller: 'opponent',
                location: 'hand',
                revealTargets: true,
                gameAction: ability.actions.chooseAction((context) => ({
                    player: context.player.opponent,
                    choices: {
                        Discard: ability.actions.discard({
                            showMessage: true,
                            message: 'discarding stufff',
                            player: context.player.opponent
                        }),
                        Damage: ability.actions.dealDamage({
                            amount: 1,
                            target: context.player.opponent.phoenixborn,
                            showMessage: true
                        })
                    }
                }))
            }
        });
    }
}

MemoryTheft.id = 'memory-theft';

module.exports = MemoryTheft;
