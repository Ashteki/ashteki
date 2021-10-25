const { Magic, Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonFallen extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            location: 'spellboard',
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.type === 'Ally' && event.card.controller == context.player
            },
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.action({
            title: 'Summon Fallen',
            location: 'spellboard',
            cost: [
                ability.costs.mainAction(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Ceremonial)])
            ],
            condition: (context) => context.player.spellboard.some((s) => s.status > 0),
            target: {
                activePromptTitle:
                    'Choose which Summon Fallen books to remove a status token from',
                mode: 'upTo',
                numCards: 3,
                cardCondition: (card) => card.id === 'summon-fallen' && card.status > 0,
                location: 'spellboard',
                gameAction: ability.actions.removeStatus()
            },
            then: (context) => ({
                gameAction: ability.actions.summon({
                    conjuration: 'fallen',
                    count: context.target.length
                })
            })
        });
    }
}

SummonFallen.id = 'summon-fallen';

module.exports = SummonFallen;
