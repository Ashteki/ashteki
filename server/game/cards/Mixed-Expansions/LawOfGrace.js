const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class LawOfGrace extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.removeDamage((context) => ({
                target: context.player.phoenixborn,
                amount: 1
            }))
        });

        this.persistentEffect({
            targetController: 'Any',
            match: (card) => card.type === CardType.Phoenixborn,
            effect: ability.effects.preventDamage(1)
        });

        this.bound();
        this.fleeting();
    }
}

LawOfGrace.id = 'law-of-grace';

module.exports = LawOfGrace;
