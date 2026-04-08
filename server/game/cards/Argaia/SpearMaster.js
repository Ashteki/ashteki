const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SpearMaster extends Card {
    setupCardAbilities(ability) {
        this.targetCards = [];

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
            title: 'Spear Volley',
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
            then: (context) => ({
                alwaysTriggers: true,
                condition: (context) => context.priorContext.tokenCount > 0,
                // gameAction: ability.actions.sequentialDamage((context) => ({
                //     numSteps: context.priorContext.tokenCount
                // }))
                ...this.getTargetData(ability, context.tokenCount)
            })
        });
    }

    getTargetData = (ability, remainingPings) => {
        if (!remainingPings || remainingPings === 0) {
            return undefined;
        }
        let returnValue = {
            alwaysTriggers: true,
            target: {
                showCancel: true,
                activePromptTitle: 'Choose a target to deal 1 damage to',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                cardCondition: (c, context) => !this.targetCards?.includes(c),
                gameAction: ability.actions.dealDamage(),
                onSelectCallback: (player, card) => {
                    this.targetCards.push(card);
                    return true;
                }
            }
        };

        returnValue.then = this.getTargetData(ability, remainingPings - 1);

        return returnValue;
    };
}

SpearMaster.id = 'spear-master';

module.exports = SpearMaster;
