const { BattlefieldTypes, Level, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class PuncturingWind extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'upTo',
                numDice: 2,
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose a unit or phoenixborn to prevent block/guard',
                    optional: true,
                    cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
                    controller: 'opponent',
                    cardCondition: (card, context) => card !== context.source,
                    gameAction: ability.actions.cardLastingEffect({
                        effect: [
                            ability.effects.cardCannot('guard'),
                            ability.effects.cardCannot('block')
                        ],
                        duration: 'untilEndOfTurn'
                    })
                }
            }
        });
    }
}

PuncturingWind.id = 'puncturing-wind';

module.exports = PuncturingWind;
