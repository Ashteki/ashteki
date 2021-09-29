const Card = require('../../Card.js');

class LawOfAssurance extends Card {
    setupCardAbilities(ability) {
        this.entersSpellboard({
            gameAction: ability.actions.setDieLevel((context) => ({
                target: context.player.dice,
                level: 'class'
            }))
        });

        this.persistentEffect({
            condition: () => !this.exhausted,
            targetController: 'Any',
            effect: [
                ability.effects.playerCannot(
                    'changeDie',
                    (context) => context.source.owner === context.player.opponent
                ),
                ability.effects.playerCannot('changeOpponentsDice')
            ]
        });

        this.bound();
        this.fleeting();
    }
}

LawOfAssurance.id = 'law-of-assurance';

module.exports = LawOfAssurance;
