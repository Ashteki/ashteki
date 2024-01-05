const Card = require('../../Card.js');

class Judgment extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Judgment',
            effect: 'destroy all units',
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => context.game.unitsInPlay,
                gameAction: ability.actions.orderedAoE({
                    gameAction: ability.actions.destroy({ showMessage: true }),
                    promptTitle: 'Judgment'
                })
            }
        });
    }
}

Judgment.id = 'judgment';

module.exports = Judgment;
