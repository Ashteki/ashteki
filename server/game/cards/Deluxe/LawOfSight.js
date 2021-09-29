const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class LawOfSight extends Card {
    setupCardAbilities(ability) {
        this.entersSpellboard({
            may: 'draw up to 2 cards',
            location: 'spellboard',
            gameAction: ability.actions.playerChosenAmountDraw((context) => ({
                target: context.player,
                amount: 2
            }))
        });

        this.persistentEffect({
            condition: () => !this.exhausted,
            targetController: 'Any',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.source.type === CardType.ReactionSpell
            )
        });

        this.bound();
        this.fleeting();
    }
}

LawOfSight.id = 'law-of-sight';

module.exports = LawOfSight;
