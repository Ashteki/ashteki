const AspectCard = require('../../../solo/AspectCard');

class Silksteel extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            targets: {
                webbed: {
                    mode: 'auto',
                    aim: 'left',
                    cardCondition: (card) => card.anyEffect('webbed')
                },
                leftmost: {
                    mode: 'auto',
                    aim: 'left',
                    cardCondition: (card) => !card.anyEffect('webbed')
                }
            },
            gameAction: ability.actions.conditional({
                condition: (context) => context.targets.webbed,
                trueGameAction: ability.actions.destroy((context) => ({
                    target: context.targets.webbed,
                    showMessage: true
                })),
                falseGameAction: ability.actions.attachConjuredAlteration((context) => ({
                    conjuredAlteration: 'webbed',
                    target: context.targets.leftmost
                }))
            })
        });
    }
}

Silksteel.id = 'silksteel';

module.exports = Silksteel;
