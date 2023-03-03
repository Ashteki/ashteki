const { Level, CardType } = require("../../../constants");
const AspectCard = require("../../solo/AspectCard");

class Glare extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            condition: () => !this.exhausted,
            targetController: 'Any',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.source.type === CardType.ReactionSpell ||
                    context.source.reactionSpellInHand ||
                    context.source.type === CardType.ActionSpell
            )
        });
    }
}

Glare.id = 'glare';

module.exports = Glare