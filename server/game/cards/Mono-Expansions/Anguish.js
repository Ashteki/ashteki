const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Anguish extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Anguish',
            message: '{0} plays {1}',
            messageArgs: (context) => [context.player, context.source],
            target: {
                cardType: CardType.Phoenixborn,
                // autoTarget: (context) => context.player.opponent.phoenixborn
                gameAction: ability.actions.chooseAction((context) => ({
                    player: context.target.controller,
                    choices: {
                        Discard: ability.actions.conditional({
                            condition: (context) => context.target.controller.hand.length > 0,
                            trueGameAction: ability.actions.discardAtRandom({
                                target: context.target.controller
                            }),
                            falseGameAction: ability.actions.addDamageToken({
                                amount: 2,
                                showMessage: true
                            })
                        }),
                        'Take 2 wounds': ability.actions.addDamageToken((context) => ({
                            target: context.target,
                            amount: 2,
                            showMessage: true
                        }))
                    }
                }))
            },
            then: (context) => this.getSecondClause(ability, context)
        });
    }

    getSecondClause(ability, context) {
        const player = context.target.controller;
        if (player.dice.filter((d) => !d.exhausted).length < 2) {
            return {
                gameAction: ability.actions.addDamageToken((context) => ({
                    target: context.preThenEvent.context.target,
                    amount: 2,
                    showMessage: true
                }))
            };
        }

        return {
            target: {
                toSelect: 'die',
                mode: 'exactly',
                owner: 'opponent',
                dieCondition: (die) => !die.exhausted,
                numDice: 2,
                announceTargets: true,
                gameAction: ability.actions.chooseAction((context) => ({
                    player: context.preThenEvent.context.target.controller,
                    choices: {
                        'Exhaust 2 dice': ability.actions.exhaustDie({
                            showMessage: true
                        }),
                        'Take 2 wounds': ability.actions.addDamageToken((context) => ({
                            target: context.preThenEvent.context.target,
                            amount: 2,
                            showMessage: true
                        }))
                    }
                }))
            }
        }
    }
}

Anguish.id = 'anguish';

module.exports = Anguish;
