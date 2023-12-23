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
            gameAction: ability.actions.removeStatus({ target: this }),
            then: {
                condition: () => this.status === 0,
                gameAction: ability.actions.discard({ target: this }),
                then: {
                    gameAction: ability.actions.addRedRainsToken((context) => ({
                        showMessage: true,
                        shortMessage: true,
                        warnMessage: true,
                        target: context.player.phoenixborn
                    }))
                }
            }
        });
    }

    get statusCount() {
        return 3;
    }
}

ScarletSeed.id = 'scarlet-seed';

module.exports = ScarletSeed;
