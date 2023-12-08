const { Magic } = require('../../constants');
const Card = require('../Card');

class ChimeraCard extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.level = 'S';
        this.stage = 1;
    }

    get heroic() {
        return this.level === 'H';
    }

    get setup() {
        return [];
    }

    get threat() {
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
