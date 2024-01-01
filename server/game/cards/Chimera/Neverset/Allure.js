const AspectCard = require('../../../solo/AspectCard');

class Allure extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
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
