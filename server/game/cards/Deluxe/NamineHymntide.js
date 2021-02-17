const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class NamineHymntide extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Calming Melody',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Sympathy)])
            ],
            gameAction: ability.actions.draw(),
            then: {
                may: 'exhaust both Phoenixborn',
                gameAction: ability.actions.exhaust((context) => ({
                    target: [context.player.phoenixborn, context.player.opponent.phoenixborn]
                }))
            }
        });
    }
}

NamineHymntide.id = 'namine-hymntide';

module.exports = NamineHymntide;
