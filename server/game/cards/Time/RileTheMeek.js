const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RileTheMeek extends Card {
    getDamageAmount = (context) =>
        context.player.unitsInPlay.filter((u) => u.printedAttack === 0 && !u.exhausted).length;

    setupCardAbilities(ability) {
        this.play({
            title: 'Rile the Meek',
            effect: 'deal 1 damage to a unit {1} times',
            effectArgs: (context) => this.getDamageAmount(context),
            condition: (context) => this.getDamageAmount(context) > 0,
            then: (context) => ({
                ...this.getTargettedAbilityChain(ability, this.getDamageAmount(context))
            })
        });
    }
}

RileTheMeek.id = 'rile-the-meek';

module.exports = RileTheMeek;
