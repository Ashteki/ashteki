const { Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class BrilliantDisplay extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequentialForEach((context) => ({
                forEach: this.getChargingDice(context),
                action: ability.actions.dealDamage({
                    promptForSelect: {
                        activePromptTitle: 'Choose a unit to deal 1 damage to',
                        optional: true,
                        cardType: BattlefieldTypes,
                        controller: 'opponent'
                    }
                })
            }))
        });
    }

    getXNumber(context) {
        return context.player.opponent.charmedUnits.length;
    }

    getChargingDice(context) {
        return context.player.chargedCards.reduce(
            (agg, card) => agg.concat(card.dieUpgrades.filter((u) => u.magic === Magic.Artifice)),
            []
        );
    }
}

BrilliantDisplay.id = 'brilliant-display';

module.exports = BrilliantDisplay;
