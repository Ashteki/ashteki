const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants.js');

class Willpower extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Willpower',
            target: {
                activePromptTitle: (context) =>
                    `Choose a unit receive ${context.player.hand.length} damage`,
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.player.hand.length
                }))
            },
        });
    }
}

Willpower.id = 'willpower';

module.exports = Willpower;
