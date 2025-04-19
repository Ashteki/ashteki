const { Level, BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SurgingTempest extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Surging Tempest',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            gameAction: ability.actions.draw(),
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose 2 dice to raise one level',
                    optional: true,
                    toSelect: 'die',
                    mode: 'upTo',
                    numDice: 2,
                    dieCondition: (die) => !die.exhausted && die.level !== Level.Power,
                    owner: 'self',
                    gameAction: ability.actions.raiseDie()
                },
                then: {
                    condition: (context) => context.source.focus > 0,
                    cost: ability.costs.chosenDiscard(1, true),
                    target: {
                        activePromptTitle: 'Choose a unit to deal 1 damage to',
                        cardType: BattlefieldTypes,
                        gameAction: ability.actions.dealDamage()
                    },
                    then: {
                        condition: (context) => context.source.focus > 1,
                        cost: ability.costs.chosenDiscard(1, true),
                        target: {
                            activePromptTitle: 'Choose a phoenixborn to deal 1 damage to',
                            cardType: PhoenixbornTypes,
                            gameAction: ability.actions.dealDamage()
                        }
                    }
                }
            }
        });
    }
}

SurgingTempest.id = 'surging-tempest';

module.exports = SurgingTempest;
