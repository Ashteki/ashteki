const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SpearMaster extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.addStatusToken({
                amount: 2
            })
        });

        this.forcedReaction({
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.addStatusToken({
                amount: 2
            })
        });

        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    return (
                        event.attackingPlayer === context.source.controller &&
                        event.attackers.includes(context.source) &&
                        context.source.controller.unitsInPlay.some(u => u.status > 0)
                    );
                }
            },
            gameAction: ability.actions.collectStatusTokens({
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.status > 0 && card.controller === this.controller
            }),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.priorContext.tokenCount > 0,
                target: {
                    activePromptTitle: (context) =>
                        `Choose up to ${context.priorContext.tokenCount} units to deal 1 damage to`,
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    mode: 'upTo',
                    numCards: (context) => context.priorContext.tokenCount,
                    gameAction: ability.actions.orderedAoE({
                        gameAction: ability.actions.dealDamage({ showMessage: true }),
                        promptTitle: 'Spear Volley'
                    })
                }
            }
        });
    }
}

SpearMaster.id = 'spear-master';

module.exports = SpearMaster;
