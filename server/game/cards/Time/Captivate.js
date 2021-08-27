const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Captivate extends Card {
    setupCardAbilities(ability) {
        this.entersSpellboard({
            location: 'spellboard',
            target: {
                optional: true,
                activePromptTitle: 'Destroy a target exhausted unit with a charm die on it',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.hasCharmDie && card.exhausted,
                gameAction: ability.actions.destroy()
            }
        });

        this.action({
            title: 'Captivate',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    until: {
                        onBeginTurn: (event) => event.player === context.player,
                        onBeginRound: () => true
                    },
                    effect: ability.effects.cardCannot('attack')
                }))
            },
            effect: 'prevent {1} from attacking next turn',
            effectArgs: (context) => context.target
        });
    }
}

Captivate.id = 'captivate';

module.exports = Captivate;
