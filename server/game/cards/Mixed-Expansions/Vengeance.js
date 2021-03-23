const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Vengeance extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.play({
            target: {
                activePromptTitle: 'Choose units to destroy',
                mode: 'upTo',
                numCards: (context) => context.event.context.costs.returnDice.length,
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose units to add 1 attack',
                    mode: 'upTo',
                    numCards: (context) => context.preThenEvent.context.target.length,
                    gameAction: ability.actions.cardLastingEffect({
                        duration: 'untilEndOfTurn',
                        effect: ability.effects.modifyAttack(1)
                    })
                }
            }
        });
    }
}

Vengeance.id = 'vengeance';

module.exports = Vengeance;
