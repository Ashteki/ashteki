const Card = require('../../Card.js');

class SurvivalOfTheFittest extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Survival of the Fittest',
            effect: 'destroy all units without tokens or alterations',
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) =>
                    context.game.unitsInPlay.filter(
                        (card) => card.upgrades.length === 0 && !card.hasAnyTokens()
                    ),
                gameAction: ability.actions.orderedAoE({
                    gameAction: ability.actions.destroy(),
                    promptTitle: 'Survival of the Fittest'
                })
            }
        });
    }
}

SurvivalOfTheFittest.id = 'survival-of-the-fittest';

module.exports = SurvivalOfTheFittest;
