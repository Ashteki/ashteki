const { Level } = require('../../constants');
const AbilityDsl = require('../abilitydsl');
const Card = require('../Card');

class PvEReadySpell extends Card {
    get isMovable() {
        return false;
    }

    doLowerOpponentsDice(numDice) {
        if (this.owner.opponent.activeNonBasicDiceCount === 0) {
            return;
        }

        let titleText =
            numDice === 1 ? 'Choose a die to lower' : 'Choose ' + numDice + ' dice to lower';
        const ability = this.behaviour({
            cost: AbilityDsl.costs.sideAction(),
            title: 'Chimera Behaviour',
            target: {
                activePromptTitle: titleText,
                player: 'opponent',
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'exactly',
                numDice: Math.min(numDice, this.owner.opponent.activeNonBasicDiceCount),
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: AbilityDsl.actions.lowerDie()
            },
            message: '{0} uses {1} to lower ' + numDice + ' opponent dice'
        });

        return ability;
    }

    doAoEDamage(amount, title) {
        const ability = this.ultimate({
            effect: 'deal {0} damage to all opponent units and phoenixborn',
            effectArgs: () => amount,
            target: {
                ignoreTargetCheck: true,
                autoTarget: (context) => context.player.opponent.unitsInPlay,
                gameAction: AbilityDsl.actions.orderedAoE({
                    gameAction: AbilityDsl.actions.dealDamage({ amount: amount }),
                    promptTitle: title
                })
            }
        });

        return ability;
    }
}

module.exports = PvEReadySpell;