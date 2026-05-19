const PvEOpponentCard = require('./PvEOpponentCard');

class DragonbornCard extends PvEOpponentCard {
    get setup() {
        const output = [];
        for (let i = 0; i < this.threat; i++) {
            output.push(Math.floor(i % 2) + 1);
        }
        return output;
    }

    activateReadySpell() {
        this.triggerUltimateAbility();
    }

    setupCardAbilities(ability) {
        // this.forcedReaction({
        //     when: {
        //         onAddToken: (event, context) =>
        //             event.type === 'redRains' &&
        //             event.card === context.source &&
        //             event.card.owner.checkUltimateThreshold()
        //     },
        //     gameAction: ability.actions.triggerUltimate()
        // });

        // this.forcedInterrupt({
        //     when: {
        //         onPlayerPass: (event, context) =>
        //             event.player === context.player.opponent &&
        //             context.player.threatCards.length > 0
        //     },
        //     gameAction: ability.actions.raiseDie((context) => ({
        //         target: this.owner.getBasicDie(Magic.Rage),
        //         showMessage: true
        //     }))
        // });
    }
}

module.exports = DragonbornCard;
