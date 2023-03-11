const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class BloodBrawl extends Card {
    getDamageAmount = (context) => {
        const sum = context.player.unitsInPlay.reduce((partialSum, u) => partialSum + u.damage, 0);
        return sum;
    }

    getTargetData = (ability, remainingPings) => {
        if (remainingPings === 0) {
            return undefined;
        }
        let returnValue = {
            target: {
                optional: true,
                activePromptTitle: 'Choose a target to deal 1 damage to',
                cardType: BattlefieldTypes,
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
        this.play({
            title: 'Blood Brawl',
            effect: 'deal 1 damage to a unit {1} times',
            effectArgs: (context) => this.getDamageAmount(context),
            condition: (context) => this.getDamageAmount(context) > 0,
            ...this.getTargetData(ability)
        });
    }
}

BloodBrawl.id = 'blood-brawl';

module.exports = BloodBrawl;
