const Card = require('../../Card.js');

class EmpyreanMount extends Card {
    setupCardAbilities(ability) {
        this.dismount();

        //Battlemaster
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some(
                        (b) => b.attacker === context.source && this.attack.isPBAttack // Not sure about second conditional
                    );
                }
            },
            target: {
                activePromptTitle: 'Choose a unit to force block',
                optional: true,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                cardCondition: (card, context) => card !== context.source,
                gameAction: (context) => [
                    ability.actions.cardLastingEffect({
                        effect: ability.effects.forceBlock(), //Yet to define where this effect takes place
                        duration: 'untilEndOfTurn'
                    }),
                    this.attack.setBlockerForAttacker(context.card, context.source)
                ]
            }
        });
    }
}

EmpyreanMount.id = 'empyrean-mount';

module.exports = EmpyreanMount;
