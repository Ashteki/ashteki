const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class ServeTheCity extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Serve the City',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                optional: true,
                cardCondition: (card) => !card.exhausted,
                activePromptTitle: 'Choose a unit to Serve the City',
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.dealDamage()
            },
            then: {
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(1),
                    target: context.preThenEvent.card
                })),
                then: {
                    condition: (context) => context.preThenEvent.context.preThenEvent.card.canAttack(),
                    target: {
                        optional: true,
                        ignoreTargetCheck: true,
                        activePromptTitle: 'Choose a target to attack',
                        cardType: [CardType.Phoenixborn, ...BattlefieldTypes],
                        controller: 'opponent',
                        gameAction: ability.actions.attack((context) => ({
                            attacker: context.preThenEvent.card
                        }))
                    },

                }

            }
        })
    }
}

ServeTheCity.id = 'serve-the-city';

module.exports = ServeTheCity;
