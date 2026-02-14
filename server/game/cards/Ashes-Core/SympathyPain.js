const Card = require('../../Card.js');
const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');

class SympathyPain extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAddToken: (event, context) =>
                    // it's my pb
                    event.card === context.player.phoenixborn &&
                    // it's a wound
                    event.type === 'damage' &&
                    event.context.player === context.player.opponent &&
                    event.card.damage < event.card.life
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

SympathyPain.id = 'sympathy-pain';

module.exports = SympathyPain;
