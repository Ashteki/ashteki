const { BattlefieldTypes } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class AttachConjuredAlterationAction extends CardGameAction {
    setDefaultProperties() {
        this.conjuredAlteration = null;
    }

    setup() {
        this.name = 'attachConjuredAlteration';
        this.targetType = BattlefieldTypes;
        this.effectMsg = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.alteration;
        };
    }

    canAffect(card, context) {
        if (!context.player.archives.some((c) => c.id === this.conjuredAlteration)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    update(context) {
        super.update(context);
        // get upgrade card
        this.alteration = context.player.archives
            .filter((c) => c.id === this.conjuredAlteration)
            .slice(0, 1)[0];
    }

    getEvent(card, context) {
        const gameAction = context.game.actions.attach({
            upgrade: this.alteration
        });

        return gameAction.getEvent(card, context);
    }
}

module.exports = AttachConjuredAlterationAction;
