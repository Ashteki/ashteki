const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class DreamFracture extends Card {
    setupCardAbilities(ability) {
        this.action({
            condition: (context) =>
                context.player.checkRestrictions('changeOpponentsDice') &&
                context.player.opponent.dice.some((d) => !d.exhausted),
            title: 'Dream Fracture',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                targetsPlayer: true,
                activePromptTitle: 'Choose a die to lower',
                toSelect: 'die',
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    !context.player.opponent.dice.some(
                        (d) => d.level === Level.Power && !d.exhausted
                    ),
                target: {
                    autoTarget: (context) => context.player.opponent.phoenixborn,
                    gameAction: ability.actions.dealDamage({
                        amount: 1,
                        showMessage: true
                    })
                }
            }
        });
    }
}

DreamFracture.id = 'dream-fracture';

module.exports = DreamFracture;
