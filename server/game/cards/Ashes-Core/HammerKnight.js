const Card = require('../../Card.js');

class HammerKnight extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.afterDestroysFighting({
            autoResolve: true,
            target: {
                optional: true,
                activePromptTitle: 'Aftershock 1',
                waitingPromptTitle: 'Aftershock 1: waiting for opponent',
                cardType: ['Ally', 'Conjuration'],
                cardCondition: (card, context) => card !== context.event.card,
                gameAction: ability.actions.dealDamage()
            }
        });
    }
}

HammerKnight.id = 'hammer-knight';

module.exports = HammerKnight;
