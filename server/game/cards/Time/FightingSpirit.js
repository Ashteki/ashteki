const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FightingSpirit extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            location: 'spellboard',
            when: {
                onCardDestroyed: (event, context) =>
                    BattlefieldTypes.includes(event.clone.type) &&
                    event.clone.controller == context.player &&
                    event.clone.status > 0
            },
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.action({
            title: 'Fighting Spirit',
            location: 'spellboard',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            target: {
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'untilEndOfTurn',
                        effect: ability.effects.modifyAttack(context.source.status)
                    })),
                    ability.actions.moveToken((context) => ({
                        from: context.source,
                        to: context.target,
                        type: 'status'
                    }))
                ])
            }
        });
    }
}

FightingSpirit.id = 'fighting-spirit';

module.exports = FightingSpirit;
