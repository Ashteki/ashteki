const Card = require('../../Card.js');

class WolfpackLeader extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 2,
                target: context.source
            }))
        });

        this.forcedReaction({
            when: {
                // it's my turn
                onBeginTurn: (event, context) => event.player === context.player
            },
            location: 'play area',
            cost: [ability.costs.loseStatus(1)],
            may: 'Call the Pack',
            gameAction: ability.actions.summon({ conjuration: 'pack-wolf' })
        });
    }
}

WolfpackLeader.id = 'wolfpack-leader';

module.exports = WolfpackLeader;
