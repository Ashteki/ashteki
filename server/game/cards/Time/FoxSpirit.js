const { Level, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FoxSpirit extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Keen 1',
            target: {
                activePromptTitle: 'Choose a die to raise',
                optional: true,
                toSelect: 'die',
                dieCondition: (die) => !die.exhausted && die.level !== Level.Power,
                owner: 'self',
                gameAction: ability.actions.raiseDie()
            }
        });
        this.forcedReaction({
            title: 'Pounce 2',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return (
                        event.attackers.includes(context.source) &&
                        event.target.exhausted &&
                        !PhoenixbornTypes.includes(event.target.type)
                    );
                }
            },
            gameAction: ability.actions.cardLastingEffect((context) => ({
                duration: 'untilEndOfTurn',
                target: context.source,
                effect: ability.effects.modifyAttack(() => this.getAbilityNumeric(2))
            }))
        });
    }
}

FoxSpirit.id = 'fox-spirit';

module.exports = FoxSpirit;
