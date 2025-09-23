const Card = require('../../Card.js');

class RisingTides extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Rising Tides',
            effect: 'deal 1 damage to all units at the end of next turn this round',
            gameAction: ability.actions.delayedEffect((context) => {
                const currentRound = this.game.round;
                return {
                    when: {
                        onTurnEnded: (event) =>
                            event.player !== context.player && event.round === currentRound
                    },
                    gameAction: ability.actions.orderedAoE((context) => ({
                        promptTitle: 'Rising Tides',
                        activePromptTitle: 'Choose the order of damage',
                        target: context.game.unitsInPlay,
                        gameAction: ability.actions.dealDamage({ showMessage: true }),
                    }))
                };
            })

        });
    }
}

RisingTides.id = 'rising-tides';

module.exports = RisingTides;
