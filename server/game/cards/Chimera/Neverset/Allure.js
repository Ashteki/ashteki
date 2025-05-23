const AspectCard = require('../../../solo/AspectCard');

class Allure extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            message: '{0} uses {1}',
            messageArgs: (context) => [context.player, context.source],

            log: 'each',
            gameAction: ability.actions.draw((context) => ({
                target: context.player.opponent,
                showMessage: true
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
