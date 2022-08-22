const Card = require('../../Card.js');

class PrismTetra extends Card {
    static variant = 1;

    constructor(owner, cardData) {
        super(owner, cardData);
        this.variant = PrismTetra.variant;
        if (PrismTetra.variant < 9) {
            PrismTetra.variant++;
        } else {
            PrismTetra.variant = 1;
        }
    }

    getImageStub() {
        return this.variant > 1 ? this.id + '-' + this.variant : this.id;
    }

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
