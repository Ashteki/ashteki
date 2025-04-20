const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Reverberate extends Card {
    getTargetData = (ability, remainingPings) => {
        if (remainingPings === 0) {
            return {
                alwaysTriggers: true,
                gameAction: ability.actions.draw()
            };
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

    getDamageAmount = (context) => {
        const count = context.player.discard.filter((c) => c.id === 'reverberate').length;
        return count + 1;
    };

    setupCardAbilities(ability) {
        const targetDefinition = this.getTargetData(ability);
        this.play({
            ...targetDefinition
        });
    }
}

Reverberate.id = 'reverberate';

module.exports = Reverberate;
