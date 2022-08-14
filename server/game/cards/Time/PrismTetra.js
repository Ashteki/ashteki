const Card = require('../../Card.js');

class PrismTetra extends Card {
    setupCardAbilities(ability) {
        this.groupTactics(1);

        this.fearful();

        this.forcedInterrupt({
            autoResolve: true,
            when: {
                onRoundEnded: () => !this.status
            },
            gameAction: ability.actions.discard((context) => ({
                target: context.source
            }))
        });
    }
}

PrismTetra.id = 'prism-tetra';

module.exports = PrismTetra;
