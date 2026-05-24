const { Magic } = require('../../constants');
const PvEOpponentCard = require('./PvEOpponentCard');

class ChimeraCard extends PvEOpponentCard {
    getThreat() {
        return this.setup.length;
    }

    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onAddToken: (event, context) =>
                    event.type === 'redRains' &&
                    event.card === context.source &&
                    event.card.owner.checkUltimateThreshold()
            },
            gameAction: ability.actions.triggerUltimate()
        });

        this.forcedInterrupt({
            when: {
                onPlayerPass: (event, context) =>
                    event.player === context.player.opponent &&
                    context.player.threatCards.length > 0
            },
            gameAction: ability.actions.raiseDie((context) => ({
                target: this.owner.getBasicDie(Magic.Rage),
                showMessage: true
            }))
        });
    }
}

module.exports = ChimeraCard;
