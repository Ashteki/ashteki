const { CardType, BattlefieldTypes } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class SweepingStrike extends AspectCard {
    getDamageAmount = (context) => context.source.attack;

    getTargetData = (ability, remainingPings) => {
        if (remainingPings === 0) {
            return undefined;
        }
        let returnValue = {
            alwaysTriggers: true,
            target: {
                cardCondition: (card) =>
                    card.type === CardType.Phoenixborn ||
                    card.controller.isRightmost(card),
                showCancel: true,
                activePromptTitle: 'Choose a target to be dealt 1 damage',
                cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                player: 'opponent',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({
                    showMessage: true
                })
            }
        };
        if (remainingPings === undefined) {
            returnValue.then = (context) =>
                this.getTargetData(ability, this.getDamageAmount(context) - 1);
        } else {
            returnValue.then = this.getTargetData(ability, remainingPings - 1);
        }
        return returnValue;
    };
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.afterDestroysFighting({
            autoResolve: true,
            effect: 'deal 1 damage to a unit {1} times',
            effectArgs: (context) => this.getDamageAmount(context),
            condition: (context) => this.getDamageAmount(context) > 0,
            ...this.getTargetData(ability)
        });
    }
}

SweepingStrike.id = 'sweeping-strike';

module.exports = SweepingStrike;
