const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class Tailwind extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Tailwind',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.phoenixborn.isAirborne,
                trueGameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(1),
                    target: context.player.unitsInPlay
                }))
            }),
            then: {
                may: 'spend one basic die to take an additional side action',
                cost: [ability.costs.focus(1), ability.costs.dice([new DiceCount(1, Level.Basic)])],
                gameAction: ability.actions.addSideAction({ amount: 1 })
            }
        });
    }
}

Tailwind.id = 'tailwind';

module.exports = Tailwind;
