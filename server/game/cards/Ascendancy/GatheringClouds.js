const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class GatheringClouds extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.summon({
                conjuration: 'cloud-spirit',
                count: 2
            }),
            then: {
                alwaysTriggers: true,
                condition: (context) => !context.player.phoenixborn.isAirborne,
                target: {
                    toSelect: 'die',
                    autoTarget: (context) =>
                        context.player.findDie(
                            (die) => die.magic === Magic.Astral && die.exhausted
                        ),
                    gameAction: ability.actions.resolveDieAbility((context) => ({
                        targetCard: context.player.phoenixborn
                    }))
                }
            }
        });
    }
}

GatheringClouds.id = 'gathering-clouds';

module.exports = GatheringClouds;
