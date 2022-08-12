const Card = require('../../Card.js');

class DarkwaterHunter extends Card {
    setupCardAbilities(ability) {
        this.stalk();

        this.reaction({
            isLimited: true,
            location: 'hand',
            when: {
                onAddToken: (event, context) =>
                    // wounds on opponent pb
                    event.type == 'damage' &&
                    event.card == context.player.opponent.phoenixborn &&
                    // don't trigger on game end
                    event.card.damage < event.card.life
            },
            gameAction: ability.actions.playCard(() => ({
                target: this,
                ignoreActionCost: true,
                isLimited: true,
                playedAsReaction: true
            }))
        });
    }
}

DarkwaterHunter.id = 'darkwater-hunter';

module.exports = DarkwaterHunter;
