const { Magic, BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SnakeBite extends Card {
    setupCardAbilities(ability) {
        this.entersSpellboard({
            target: {
                activePromptTitle: 'Choose an exhausted Charm die to resolve its die power',
                optional: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Charm && die.exhausted,
                gameAction: ability.actions.resolveDieAbility()
            }
        });

        this.action({
            title: 'Snake Bite',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                optional: true,
                activePromptTitle: 'Choose a unit with a charm die on it to receive one damage',
                cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
                controller: 'any',
                cardCondition: (card, context) =>
                    card.hasCharmDie ||
                    (PhoenixbornTypes.includes(card.type) &&
                        card.owner.deck.length === 0 &&
                        card.owner !== context.player),
                gameAction: ability.actions.dealDamage({ amount: 1 })
            }
        });
    }
}

SnakeBite.id = 'snake-bite';

module.exports = SnakeBite;
