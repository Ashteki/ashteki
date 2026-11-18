const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class BrilliantDisplay extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Brilliant Display',
            effect: 'deal 1 damage to a unit {1} times',
            effectArgs: (context) => this.getDamageCount(context),
            condition: (context) => this.getDamageCount(context) > 0,
            then: (context) => ({
                ...this.getTargetData(ability, this.getDamageCount(context))
            })
        });
    }

    getDamageCount = (context) => this.getChargingDice(context).length;

    getChargingDice(context) {
        return context.player.chargedCards.reduce(
            (agg, card) => agg.concat(card.dieUpgrades.filter((u) => u.magic === Magic.Artifice)),
            []
        );
    }
}

BrilliantDisplay.id = 'brilliant-display';

module.exports = BrilliantDisplay;
