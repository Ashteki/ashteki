const { Level, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');
const { player } = require('../../Effects/EffectBuilder.js');

class Magnificence extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Magnificence',
            // effect: "reroll {1} of their opponent's dice: {2}",
            // effectArgs: (context) => [context.target.length, context.target],
            target: {
                targetsPlayer: true,
                toSelect: 'die',
                dieCondition: (d) => !d.exhausted,
                mode: 'upTo',
                numDice: 4,
                gameAction: ability.actions.rerollDice()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose a unit to Invert',
                    optional: true,
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        duration: 'untilEndOfTurn',
                        effect: [
                            ability.effects.setAttack(() => {
                                const printedLife =
                                    context.target.mostRecentEffect('setPrintedLife') ||
                                    context.target.printedLife;
                                return Math.max(
                                    0,
                                    printedLife + context.target.sumEffects('modifyAttack')
                                );
                            }),
                            ability.effects.setLife(() => {
                                const printedAttack =
                                    context.target.mostRecentEffect('setPrintedAttack') ||
                                    (context.target.printedAttack == 'X'
                                        ? context.target.mostRecentEffect('setPrintedAttack')
                                        : context.target.printedAttack);
                                return Math.max(
                                    0,
                                    printedAttack + context.target.sumEffects('modifyLife')
                                );
                            })
                        ]
                    }))
                },
                then: {
                    alwaysTriggers: true,
                    effect: 'deal 1 damage to {1}',
                    effectArgs: (context) => context.target,
                    target: {
                        showCancel: true,
                        cardCondition: (card, context) => card !== context.source,
                        activePromptTitle: 'Deal 1 damage to a target unit',
                        controller: 'opponent',
                        cardType: BattlefieldTypes,
                        gameAction: ability.actions.dealDamage()
                    },
                    then: {
                        alwaysTriggers: true,
                        effect: 'deal 1 damage to {1}',
                        effectArgs: (context) => context.target,
                        target: {
                            showCancel: true,
                            cardCondition: (card, context) => card !== context.source,
                            activePromptTitle: 'Deal 1 damage to a target unit',
                            controller: 'opponent',
                            cardType: BattlefieldTypes,
                            gameAction: ability.actions.dealDamage()
                        }
                    }
                }
            }
        });
    }

    getPlayerOptions(context) {
        let choices = [context.player.name];

        if (context.player.checkRestrictions('changeOpponentsDice')) {
            choices.push(context.player.opponent.name);
        }
        return choices.map((t) => ({ text: t, value: t }));
    }
}


Magnificence.id = 'magnificence';

module.exports = Magnificence;
