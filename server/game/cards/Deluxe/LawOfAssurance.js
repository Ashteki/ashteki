const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class LawOfAssurance extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.setDieLevel((context) => ({
                target: context.player.dice,
                level: 'class'
            }))
        });

        this.persistentEffect({
            targetController: 'Any',
            effect: ability.effects.playerCannot(
                'changeOpponentsDie',
                (context) => context.source.type === CardType.ReactionSpell
            )
        });

        this.bound();
        this.fleeting();
    }
}

LawOfAssurance.id = 'law-of-assurance';

module.exports = LawOfAssurance;
