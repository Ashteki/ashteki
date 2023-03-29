const Card = require('../../Card.js');

class ThreeEyedOwl extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Memory Drain 1',
            when: {
                onPhaseEnded: (event) => event.phase === 'prepare'
            },
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.chosenDiscard()
            }
        });

        this.entersPlay({
            title: 'Peer 1',
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.exposeRandom()
            }
        });
    }
}

ThreeEyedOwl.id = 'three-eyed-owl';

module.exports = ThreeEyedOwl;
