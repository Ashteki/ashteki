const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class FadeAway extends Card {
    setupCardAbilities(ability) {
        this.forcedInterrupt({
            title: 'Fade Away',
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.conditional((context) => ({
                trueGameAction: ability.actions.purge({
                    target: context.source.parent
                }),
                falseGameAction: ability.actions.destroy({
                    target: context.source.parent,
                    purge: context.source.parent.type === CardType.Ally
                })
            }))
        });
    }
}

FadeAway.id = 'fade-away';

module.exports = FadeAway;
