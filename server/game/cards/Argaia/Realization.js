const Card = require('../../Card.js');

class Realization extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.additionalDraw(1)
        });

        this.action({
            title: 'Use Ability',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            condition: (context) => context.player.deckIsEmpty,
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.sequential([
                    ability.actions.exposeRandomDiscard((context) => ({
                        target: context.player,
                        moveTo: 'purge'
                    })),
                    ability.actions.exposeRandomDiscard((context) => ({
                        target: context.player,
                        moveTo: 'hand'
                    }))
                ])
            }
        });
    }
}

Realization.id = 'realization';

module.exports = Realization;
