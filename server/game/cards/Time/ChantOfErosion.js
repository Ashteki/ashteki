const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChantOfErosion extends Card {
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
            title: 'Eroding',
            location: 'spellboard',
            cost: [ability.costs.mainAction(), ability.costs.exhaust(), ability.costs.loseStatus()],
            target: {
                activePromptTitle: 'Choose a unit to attach Eroding to',
                cardType: BattlefieldTypes,
                controller: 'any',
                gameAction: ability.actions.attachConjuredAlteration({
                    conjuredAlteration: 'eroding'
                })
            }
        });
    }
}

ChantOfErosion.id = 'chant-of-erosion';

module.exports = ChantOfErosion;
