const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Arrogance extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return event.attackingPlayer === context.source.owner; // my attack
                }
            },
            target: {
                optional: true,
                activePromptTitle: 'Choose an attacking unit',
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect({
                    effect: [
                        ability.effects.preventBlockByCharmedUnit(),
                        ability.effects.preventGuardByCharmedUnit()
                    ],
                    duration: 'untilEndOfTurn'
                })
            }
        });
    }
}

Arrogance.id = 'arrogance';

module.exports = Arrogance;
