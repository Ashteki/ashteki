const { BattlefieldTypes } = require('../../../constants.js');
const AbilityDsl = require('../../abilitydsl.js');
const Card = require('../../Card.js');

class FlockShepherd extends Card {
    setupCardAbilities(ability) {
        //protect
        this.persistentEffect({
            condition: () => !this.exhausted,
            match: (card) => BattlefieldTypes.includes(card.type) && card.printedAttack === 0,
            effect: [
                ability.effects.cannotBeDicePowerTarget(),
                ability.effects.cannotBeSpellTarget(),
                ability.effects.cannotBeAbilityTarget()
            ]
        });

        //gather
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.player.unitsInPlay.filter((c) => c.printedAttack === 0),
                effect: AbilityDsl.effects.modifyAttack(2),
                duration: 'untilEndOfTurn'
            })),
            effect: 'increase the attack attack value of units with a printed attack of 0 by 2'
        });
    }
}

FlockShepherd.id = 'flock-shepherd';

module.exports = FlockShepherd;
