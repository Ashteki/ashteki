const { Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class BrilliantDisplay extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Brilliant Display',
            effect: 'deal 1 damage to a unit {1} times',
            effectArgs: (context) => this.getDamageCount(context),
            condition: (context) => this.getDamageCount(context) > 0,
            ...this.getTargetData(ability)
        });
    }

    getChargingDice(context) {
        return context.player.chargedCards.reduce(
            (agg, card) => agg.concat(card.dieUpgrades.filter((u) => u.magic === Magic.Artifice)),
            []
        );
    }

    getDamageCount = (context) => this.getChargingDice(context).length;

    getTargetData = (ability, remainingPings) => {
        if (remainingPings === 0) {
            return undefined;
        }
        let returnValue = {
            alwaysTriggers: true,
            target: {
                showCancel: true,
                activePromptTitle: 'Choose a target to deal 1 damage to',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage()
            }
        };
        if (remainingPings === undefined) {
            returnValue.then = (context) =>
                this.getTargetData(ability, this.getDamageCount(context) - 1);
        } else {
            returnValue.then = this.getTargetData(ability, remainingPings - 1);
        }
        return returnValue;
    };

}

BrilliantDisplay.id = 'brilliant-display';

module.exports = BrilliantDisplay;
