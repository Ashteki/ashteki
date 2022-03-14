const Card = require('../../Card.js');

class FoxSpirit extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Keen 1',
            target: {
                activePromptTitle: 'Choose a die to raise',
                optional: true,
                toSelect: 'die',
                dieCondition: (die) => !die.exhausted,
                owner: 'self',
                gameAction: ability.actions.raiseDie()
            }
        });
        this.forcedReaction({
            title: 'Pounce 2',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some(
                        (b) =>
                            b.attacker === context.source &&
                            b.target.exhausted &&
                            b.target.type != 'Phoenixborn'
                    );
                }
            },
            gameAction: ability.actions.cardLastingEffect((context) => ({
                duration: 'untilEndOfTurn',
                target: context.source,
                effect: ability.effects.modifyAttack(2)
            }))
        });
    }
}

FoxSpirit.id = 'fox-spirit';

module.exports = FoxSpirit;
