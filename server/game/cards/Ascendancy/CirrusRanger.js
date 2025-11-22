const Card = require('../../Card.js');

class CirrusRanger extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            condition: (context) => context.player.phoenixborn.isAirborne(),
            title: 'Aerial Ambush 1',
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: {
                target: {
                    activePromptTitle: 'Choose an active die to lower',
                    optional: true,
                    toSelect: 'die',
                    controller: 'opponent',
                    dieCondition: (die) => !die.exhausted,
                    gameAction: ability.actions.lowerDie()
                }
            }
        });
    }
}

CirrusRanger.id = 'cirrus-ranger';

module.exports = CirrusRanger;
