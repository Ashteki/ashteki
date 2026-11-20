const { BattlefieldTypes, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class Nullify extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Nullify',
            when: {
                // opponent declares attackers
                onAttackersDeclared: () => true
            },
            target: {
                cardType: BattlefieldTypes,
                controller: 'any',
                activePromptTitle: 'Choose a unit to have its attack reduced by 2',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(-2)
                })
            }
        });
    }
}

Nullify.id = 'nullify';

module.exports = Nullify;
