const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SariaGuideman extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: "Heart's Pull",
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Charm)])
            ],
            gameAction: [
                ability.actions.draw(),
                ability.actions.discardTopOfDeck((context) => ({
                    target: context.player.opponent
                }))
            ]
        });
    }
}

SariaGuideman.id = 'saria-guideman';

module.exports = SariaGuideman;
