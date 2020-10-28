const Card = require('../../Card.js');

class SariaGuideman extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: "Heart's Pull",
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([{ magic: 'charm', level: 'class' }])
            ],
            gameAction: [
                ability.actions.draw()
                //TODO: discardTopOfDeck doesn't seem to work :(
                // ability.actions.discardTopOfDeck((context) => ({
                //     target: context.player.opponent
                // }))
            ],
            then: {
                message: '!! MANUAL OPPONENT DISCARD !!'
            }
        });
    }
}

SariaGuideman.id = 'saria-guideman';

module.exports = SariaGuideman;
