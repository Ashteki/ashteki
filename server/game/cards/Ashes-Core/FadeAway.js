const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class FadeAway extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Fade Away',
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.conditional((context) => ({
                // target: context.source.parent,
                condition: () => context.source.parent.type === CardType.Ally,
                trueGameAction: ability.actions.purge({
                    target: context.source.parent
                }),
                falseGameAction: ability.actions.destroy({
                    target: context.source.parent
                })
            }))
        });
    }
}

FadeAway.id = 'fade-away';

module.exports = FadeAway;
