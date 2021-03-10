const Card = require('../../Card.js');

class HammerKnight extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.afterDestroysFighting({
            target: {
                optional: true,
                activePromptTitle: 'Aftershock 1',
                waitingPromptTitle: 'Aftershock 1: waiting for opponent',
                cardType: ['Ally', 'Conjuration'],
                gameAction: ability.actions.dealDamage({ amount: 1 })
            }
        });
    }
}

HammerKnight.id = 'hammer-knight';

module.exports = HammerKnight;
