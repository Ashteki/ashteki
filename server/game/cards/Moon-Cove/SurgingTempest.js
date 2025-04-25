const { BattlefieldTypes, PhoenixbornTypes, Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class SurgingTempest extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Surging Tempest',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            gameAction: ability.actions.draw(),
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: (context) =>
                        'Choose ' +
                        Math.min(2, context.player.activeNonPowerDiceCount) +
                        ' dice to raise one level',
                    toSelect: 'die',
                    mode: 'exactly',
                    numDice: (context) => Math.min(2, context.player.activeNonPowerDiceCount),
                    dieCondition: (die) => die.level !== Level.Power && !die.exhausted,
                    owner: 'self',
                    gameAction: ability.actions.raiseDie()
                },
                then: {
                    alwaysTriggers: true,
                    condition: (context) => context.source.focus > 0,
                    cost: ability.costs.chosenDiscard(1, true),
                    then: (thenContext) => ({
                        alwaysTriggers: true,
                        condition: (context) => thenContext.player && context.source.focus > 0,
                        target: {
                            optional: true,
                            activePromptTitle: 'Choose a unit to deal 1 damage to',
                            cardType: BattlefieldTypes,
                            skipForCancel: true,
                            gameAction: ability.actions.dealDamage()
                        },
                        allowPassThen: true,
                        then: {
                            alwaysTriggers: true,
                            condition: (context) => context.source.focus > 1,
                            cost: ability.costs.chosenDiscard(1, true),
                            target: {
                                activePromptTitle: 'Choose a phoenixborn to deal 1 damage to',
                                cardType: PhoenixbornTypes,
                                gameAction: ability.actions.dealDamage()
                            }
                        }
                    })
                }
            }
        });
    }
}

SurgingTempest.id = 'surging-tempest';

module.exports = SurgingTempest;
