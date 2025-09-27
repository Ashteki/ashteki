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
            then: {
                alwaysTriggers: true,
                condition: (context) => context.priorContext.tokenCount > 0,
                gameAction: ability.actions.sequentialDamage((context) => ({
                    numSteps: context.priorContext.tokenCount
                    // action: ability.actions.dealDamage((context) => ({
                    //     promptForSelect: {
                    //         activePromptTitle: 'Choose a unit to deal 1 damage to',
                    //         cardType: BattlefieldTypes,
                    //         controller: 'opponent'
                    //     }
                    // }))
                }))
            }
        });
    }
}

SpearMaster.id = 'spear-master';

module.exports = SpearMaster;
