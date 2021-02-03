const Card = require('../../Card.js');

class LawOfSight extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            may: 'draw up to 2 cards',

            target: {
                mode: 'select',
                choices: ['1', '2'],
                handlers: [() => (this.amount = true), () => (this.amount = false)]
            },
            gameAction: ability.actions.draw(() => ({
                amount: this.amount
            }))
        });

        // this.bound();
        this.fleeting();
    }
}

LawOfSight.id = 'law-of-sight';

module.exports = LawOfSight;
