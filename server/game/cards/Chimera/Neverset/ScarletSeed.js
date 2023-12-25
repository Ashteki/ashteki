const AspectCard = require('../../../solo/AspectCard');

class ScarletSeed extends AspectCard {
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
            gameAction: ability.actions.conditional({
                condition: (context) => context.source.status === 0,
                trueGameAction: [
                    ability.actions.discard({ target: this }),
                    ability.actions.addRedRainsToken((context) => ({
                        showMessage: true,
                        shortMessage: true,
                        warnMessage: true,
                        target: context.player.phoenixborn
                    }))
                ]
            })
        });
    }

    get statusCount() {
        return 3;
    }
}

ScarletSeed.id = 'scarlet-seed';

module.exports = ScarletSeed;
