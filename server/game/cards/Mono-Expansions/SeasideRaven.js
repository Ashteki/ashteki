const Card = require('../../Card.js');

class SeasideRaven extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            effect: 'destroy {0}',
            target: {
                activePromptTitle: 'Prey 2',
                cardType: ['Ally', 'Conjuration'],
                controller: 'any',
                cardCondition: (card) => card.life <= 2,
                gameAction: ability.actions.destroy()
            }
        });

        this.persistentEffect({
            effect: ability.effects.quickStrike()
        });
    }
}

SeasideRaven.id = 'seaside-raven';

module.exports = SeasideRaven;
