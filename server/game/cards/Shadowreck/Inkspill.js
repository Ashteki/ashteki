const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Inkspill extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Inkspill',
            when: {
                onAttackersDeclared: (event, context) => {
                    return event.attackingPlayer === context.source.owner; // my attack
                }
            },
            target: {
                activePromptTitle: 'Choose up to 2 units with attack 1 or less',
                mode: 'upTo',
                numCards: 2,
                cardType: BattlefieldTypes,
                cardCondition: (card, context) => card.attack < 2,
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

Inkspill.id = 'inkspill';

module.exports = Inkspill;
