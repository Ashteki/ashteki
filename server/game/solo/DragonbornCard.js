const { Magic } = require('../../constants');
const PvEOpponentCard = require('./PvEOpponentCard');

class DragonbornCard extends PvEOpponentCard {
    get setup() {
        const output = [];
        for (let i = 0; i < this.threat; i++) {
            output.push(Math.floor(i % 2) + 1);
        }
        return output;
    }

    setupCardAbilities(ability) {
        this.statusAbility({
            condition: (context) => context.source.exhausted,
            gameAction: ability.actions.removeExhaustion((context) => ({
                target: context.player.phoenixborn,
                showMessage: true
            }))
        });

        this.forcedInterrupt({
            when: {
                onPlayerPass: (event, context) =>
                    event.player === context.player.opponent &&
                    context.player.threatCards.length > 0
            },
            gameAction: ability.actions.raiseDie((context) => ({
                target: this.owner.getBasicDie(Magic.Dragon),
                showMessage: true
            }))
        });
    }
}

module.exports = DragonbornCard;
