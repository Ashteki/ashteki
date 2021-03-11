const { Magic, Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class TempleElder extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.forcedReaction({
            inexhaustible: true,
            title: 'Resourceful 1',
            autoResolve: true,
            when: {
                onPhaseStarted: (event) => event.phase === 'playerturns'
            },
            effect: 'gain 1 status token',
            gameAction: ability.actions.addStatusToken()
        });

        this.action({
            title: 'Wisdom 1',
            cost: [
                ability.costs.sideAction(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Sympathy)]),
                ability.costs.loseStatus()
            ],
            gameAction: ability.actions.draw()
        });
    }
}

TempleElder.id = 'temple-elder';

module.exports = TempleElder;
