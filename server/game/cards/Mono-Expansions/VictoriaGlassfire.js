const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class VictoriaGlassfire extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Surprise!',
            condition: (context) => context.player.checkRestrictions('changeOpponentsDice'),
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Illusion)])
            ],
            effect: "reroll {1} of their opponent's dice: {2}",
            effectArgs: (context) => [context.target.length, context.target],
            target: {
                toSelect: 'die',
                dieCondition: (d) => !d.exhausted,
                mode: 'upTo',
                numDice: 4,
                owner: 'opponent',
                gameAction: ability.actions.rerollDice(),
            },
            then: (context) => ({
                target: {
                    toSelect: 'die',
                    dieCondition: (d) => !d.exhausted,
                    mode: 'exactly',
                    numDice: context.target.length,
                    owner: 'self',
                    gameAction: ability.actions.rerollDice()
                },
                message: '{0} then rerolls {3} their own dice: {2}',
                messageArgs: (context) => context.target.length
            })
        });
    }
}

VictoriaGlassfire.id = 'victoria-glassfire';

module.exports = VictoriaGlassfire;
