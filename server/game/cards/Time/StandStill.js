const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class StandStill extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return event.attackingPlayer === context.source.owner; // my attack
                }
            },
            target: {
                optional: true,
                activePromptTitle: 'Choose a unit',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    target: context.player.opponent.unitsInPlay.filter(
                        (c) => c.id === context.target.id
                    ),
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.cardCannot('block')
                }))
            }
        });
    }
}

StandStill.id = 'stand-still';

module.exports = StandStill;
