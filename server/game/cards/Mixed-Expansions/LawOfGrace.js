const { CardType, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class LawOfGrace extends Card {
    setupCardAbilities(ability) {
        this.entersSpellboard({
            gameAction: ability.actions.removeDamage((context) => ({
                target: context.player.phoenixborn,
                amount: 1
            }))
        });

        this.persistentEffect({
            condition: () => !this.exhausted,
            targetController: 'Any',
            match: (card) => PhoenixbornTypes.includes(card.type),
            effect: ability.effects.preventNonAttackDamage(1)
        });

        this.bound();
        this.fleeting();
    }
}

LawOfGrace.id = 'law-of-grace';

module.exports = LawOfGrace;
