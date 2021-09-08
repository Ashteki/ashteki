const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RileTheMeek extends Card {
    getDamageAmount = (context) =>
        context.player.unitsInPlay.filter((u) => u.printedAttack === 0 && !u.exhausted).length;

    getTargetData = (ability, remainingPings) => {
        if (remainingPings === 0) {
            return undefined;
        }
        let returnValue = {
            alwaysTriggers: true,
            target: {
                optional: true,
                activePromptTitle: 'Choose a target to deal 1 damage',
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
            title: 'Rile the Meek',
            effect: 'deal 1 damage to a unit {1} times',
            effectArgs: (context) => this.getDamageAmount(context),
            condition: (context) => this.getDamageAmount(context) > 0,
            ...this.getTargetData(ability)
        });
    }
}

RileTheMeek.id = 'rile-the-meek';

module.exports = RileTheMeek;
