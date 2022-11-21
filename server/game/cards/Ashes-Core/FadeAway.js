const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class FadeAway extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            title: 'Fade Away',
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.source.parent
            })),
            then: {
                condition: (context) =>
                    context.preThenEvent.card.type === CardType.Ally &&
                    context.preThenEvent.card.location === 'discard',
                gameAction: ability.actions.purge((context) => ({
                    target: context.preThenEvent.card
                }))
            }
        });
    }
}

FadeAway.id = 'fade-away';

module.exports = FadeAway;
