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

        this.forcedInterrupt({
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
                ...this.getTargettedAbilityChain(ability, context.tokenCount, {
                    cardCondition: (c) => !this.targetCards?.includes(c),
                    onSelectCallback: (player, card) => {
                        this.targetCards.push(card);
                        return true;
                    }
                })
            })
        });
    }
}

SpearMaster.id = 'spear-master';

module.exports = SpearMaster;
