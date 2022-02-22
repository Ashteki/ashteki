const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class CrystalArmor extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            inexhaustible: true,
            effect: [
                ability.effects.modifyAttack(1),
                ability.effects.modifyLife(1),
                ability.effects.modifyRecover(1)
            ]
        });

        this.reaction({
            isLimited: true,
            when: {
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent
            },
            cost: [ability.costs.dice([new DiceCount(1, Level.Power, Magic.Time)])],
            location: 'hand',
            gameAction: ability.actions.playCard(() => ({
                target: this,
                ignoreActionCost: true,
                ignoreDiceCost: true,
                isLimited: true,
                playedAsReaction: true
            }))
        });
    }
}

CrystalArmor.id = 'crystal-armor';

module.exports = CrystalArmor;
