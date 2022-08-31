const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class OceansGift extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyAttack(1)
        });

        this.forcedReaction({
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            target: {
                toSelect: 'die',
                mode: 'upTo',
                numDice: 3,
                dieCondition: (die) => !die.exhausted && die.level !== Level.Power,
                owner: 'self',
                gameAction: ability.actions.raiseDie()
            },
            message: '{0} uses {1} to raise up to 3 dice'
        });

        this.whileAttached({
            inexhaustible: true,
            effect: [
                ability.effects.gainAbility('forcedReaction', {
                    when: {
                        onAttackersDeclared: (event, context) =>
                            event.attackingPlayer === context.source.controller &&
                            event.battles.some((b) => b.attacker === context.source)
                    },
                    target: {
                        optional: true,
                        title: 'Bestow',
                        activePromptTitle: 'Choose a unit to add 1 status token to',
                        effect: 'add 1 status token',
                        gameAction: ability.actions.addStatusToken()
                    }
                })
            ]
        });
    }
}

OceansGift.id = 'oceans-gift';

module.exports = OceansGift;
