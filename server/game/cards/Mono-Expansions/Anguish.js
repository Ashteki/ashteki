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
            then: {
                gameAction: ability.actions.chooseAction((context) => ({
                    player: context.preThenEvent.context.target.controller,
                    choices: {
                        'Exhaust 2 dice': ability.actions.conditional({
                            condition: (context) =>
                                context.preThenEvent.context.target.controller.dice.filter(
                                    (d) => !d.exhausted
                                ).length >= 2,
                            trueGameAction: ability.actions.exhaustDie({
                                promptForSelect: {
                                    toSelect: 'die',
                                    dieCondition: (d) => !d.exhausted,
                                    mode: 'upTo',
                                    numDice: 2,
                                    owner: 'opponent'
                                },
                                showMessage: true
                            }),
                            falseGameAction: ability.actions.addDamageToken((context) => ({
                                target: context.preThenEvent.context.target,
                                amount: 2,
                                showMessage: true
                            }))
                        }),
                        'Take 2 wounds': ability.actions.addDamageToken((context) => ({
                            target: context.preThenEvent.context.target,
                            amount: 2,
                            showMessage: true
                        }))
                    }
                }))
            }
        });
    }
}

Anguish.id = 'anguish';

module.exports = Anguish;
