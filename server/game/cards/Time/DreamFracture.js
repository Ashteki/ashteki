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
                dieCondition: (die) => !die.exhausted,
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            },
            then: {
                condition: (context) =>
                    !context.player.opponent.dice.some((d) => d.level === 'power' && !d.exhausted),
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.player.opponent.phoenixborn,
                    showMessage: true
                }))
            }
        });
    }
}

DreamFracture.id = 'dream-fracture';

module.exports = DreamFracture;
