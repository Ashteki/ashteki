const AspectCard = require('../../../solo/AspectCard');

class Allure extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
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
}

Allure.id = 'allure';

module.exports = Allure;
