const AspectCard = require('../../../solo/AspectCard');

class Allure extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.forcedReaction({
            inexhaustible: true,
            when: {
                // it's my turn
                onBeginTurn: (event, context) => event.player === context.player
            },
            location: 'play area',
            cost: [ability.costs.loseStatus(1)],
            gameAction: ability.actions.draw((context) => ({
                target: context.player.opponent
            })),
            then: {
                gameAction: ability.actions.discardTopOfDeck((context) => ({
                    target: context.player.opponent
                }))
            }
        });
    };

    get statusCount() {
        return 2;
    }
}

Allure.id = 'allure';

module.exports = Allure;
