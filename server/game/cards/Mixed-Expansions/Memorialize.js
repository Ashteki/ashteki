const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Memorialize extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            location: 'spellboard',
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.type === 'Ally' && event.card.controller == context.player
            },
            condition: (context) => context.source.status == 0,
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.action({
            title: 'Memorialize',
            location: 'spellboard',
            cost: [ability.costs.sideAction(), ability.costs.exhaust(), ability.costs.loseStatus()],
            target: {
                cardType: [
                    CardType.ActionSpell,
                    CardType.ReactionSpell,
                    CardType.Upgrade,
                    CardType.ReadySpell
                ],
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true, shuffle: false })
            }
        });
    }
}

Memorialize.id = 'memorialize';

module.exports = Memorialize;
