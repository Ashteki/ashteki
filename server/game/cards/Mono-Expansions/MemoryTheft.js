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
            gameAction: ability.actions.makeChimeraHand((context) => ({
                target: context.player.opponent
            })),
            then: {
                alwaysTriggers: true,
                target: {
                    controller: 'opponent',
                    location: 'hand',
                    revealTargets: true,

                    gameAction: ability.actions.chooseAction((context) => ({
                        player: context.player.opponent,
                        choices: {
                            Discard: ability.actions.discard({
                                showMessage: true,
                                player: context.player.opponent
                            }),
                            Damage: ability.actions.addDamageToken({
                                amount: 1,
                                target: context.player.opponent.phoenixborn,
                                showMessage: true
                            })
                        }
                    }))
                },
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.releaseChimeraHand((context) => ({
                        target: context.player.opponent
                    }))
                }
            }
        });
    }
}

MemoryTheft.id = 'memory-theft';

module.exports = MemoryTheft;
