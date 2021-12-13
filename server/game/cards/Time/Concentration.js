const { Level, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Concentration extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Concentration',
            cost: [
                ability.costs.chosenAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(2, Level.Basic)])
            ],
            location: 'spellboard',
            // condition: (context) => context.source.status >= 7,
            gameAction: [
                ability.actions.addStatusToken((context) => ({
                    target: context.player.phoenixborn
                })),
                ability.actions.draw({ showMessage: true }),
                ability.actions.changeDice({
                    dieCondition: (d) => d.exhausted,
                    owner: 'self',
                    unexhaust: true
                })
            ],
            then: {
                condition: (context) => context.source.focus >= 1 && context.player.phoenixborn.status >= 7,
                gameAction: ability.actions.attachToPb((context) => ({
                    upgrade: context.player.archives.find((c) => c.id === 'the-awakened-state'),
                    target: context.player.phoenixborn
                })),
                message: '{0} attaches {3} to {4}',
                messageArgs: (context) => [context.player.archives.find((c) => c.id === 'the-awakened-state'), context.player.phoenixborn]
            }
        });
    }
}

Concentration.id = 'concentration';

module.exports = Concentration;
