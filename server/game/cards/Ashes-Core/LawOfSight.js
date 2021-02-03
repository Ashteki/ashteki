const Card = require('../../Card.js');

class LawOfSight extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            may: 'draw up to 2 cards',
            location: 'spellboard',
            gameAction: ability.actions.playerChosenAmountDraw((context) => ({
                target: context.player,
                amount: 2
            }))
        });

        // this.bound();
        this.fleeting();
    }
}

LawOfSight.id = 'law-of-sight';

module.exports = LawOfSight;
