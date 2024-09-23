const { Level, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Juggle extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Juggle',
            target: {
                toSelect: 'die',
                mode: 'upTo',
                numDice: 3,
                dieCondition: (die) => !die.exhausted && die.level !== Level.Power,
                owner: 'self',
                gameAction: ability.actions.raiseDie()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    targetsPlayer: true,
                    toSelect: 'die',
                    mode: 'upTo',
                    numDice: 3,
                    dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                    owner: 'opponent',
                    gameAction: ability.actions.lowerDie()
                },
                then: {
                    alwaysTriggers: true,
                    target: {
                        activePlayerPrompt: 'Choose a card to deal 3 damage to',
                        cardType: BattlefieldTypes,
                        controller: 'opponent',
                        gameAction: ability.actions.dealDamage({ amount: 3 })
                    }
                }
            }
        });
    }
}

Juggle.id = 'juggle';

module.exports = Juggle;
