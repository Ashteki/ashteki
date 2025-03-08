const Card = require('../../Card.js');

class RiverColossus extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.addKeyword({ gigantic: 1 })]
        });

        this.reaction({
            title: 'Rouse 2',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.attackers.includes(context.source);
                }
            },
            cost: [ability.costs.lowerDice(2)],
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.source,
                duration: 'untilEndOfTurn',
                effect: ability.effects.modifyAttack(2)
            }))
        });
    }
}

RiverColossus.id = 'river-colossus';

module.exports = RiverColossus;
