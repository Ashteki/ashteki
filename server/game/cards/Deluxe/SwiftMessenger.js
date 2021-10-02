const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SwiftMessenger extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.draw()
        });

        this.reaction({
            isLimited: true,
            when: {
                onCardEntersPlay: (event, context) =>
                    BattlefieldTypes.includes(event.card.type) &&
                    event.card.controller === context.player.opponent
            },
            location: 'hand',
            gameAction: ability.actions.playCard(() => ({
                target: this,
                ignoreActionCost: true,
                isLimited: true
            }))
        });
    }
}

SwiftMessenger.id = 'swift-messenger';

module.exports = SwiftMessenger;
