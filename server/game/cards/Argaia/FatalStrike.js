const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FatalStrike extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlayerPass: (event, context) => event.player === context.player.opponent
            },
            target: {
                activePromptTitle: 'Choose a card to deal 2 damage to',
                cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

FatalStrike.id = 'fatal-strike';

module.exports = FatalStrike;
