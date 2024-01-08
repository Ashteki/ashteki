const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class VenomStrike extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: [
                    ability.actions.discardTopOfDeck((context) => ({
                        amount: this.getXNumber(context)
                    })),
                    ability.actions.dealDamage((context) => ({
                        target: context.target.phoenixborn,
                        amount: this.getXNumber(context)
                    })),
                    ability.actions.sequentialForEach((context) => ({
                        forEach: this.getAllExhaustedUnitDieUpgrades(context),
                        action: ability.actions.detachDie()
                    }))
                ]
            }
        });
    }

    getXNumber(context) {
        return context.player.opponent.charmedUnits.length;
    }

    getAllExhaustedUnitDieUpgrades(context) {
        return context.player.opponent.charmedUnits
            .filter((u) => u.exhausted)
            .reduce(
                (agg, card) => agg.concat(card.dieUpgrades.filter((u) => u.magic === Magic.Charm)),
                []
            );
    }
}

VenomStrike.id = 'venom-strike';

module.exports = VenomStrike;
