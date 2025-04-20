const Card = require('../../Card.js');

class CeruleanDiver extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.addKeyword({ gigantic: 1 })]
        });

        this.forcedReaction({
            title: 'Dive 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.attackers.includes(context.source);
                }
            },
            gameAction: ability.actions.draw({ bottom: true, amount: this.getAbilityNumeric(1) })
        });
    }
}

CeruleanDiver.id = 'cerulean-diver';

module.exports = CeruleanDiver;
