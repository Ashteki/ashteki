const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class WeightOfTheWorld extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a unit to move the exhaustion token to',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.moveToken((context) => ({
                    type: 'exhaustion',
                    from: context.player.phoenixborn,
                    to: context.target
                }))
            }
        });
    }
}

WeightOfTheWorld.id = 'weight-of-the-world';

module.exports = WeightOfTheWorld;
