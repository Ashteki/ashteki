const { CardType, Aim, ActionType } = require('../../constants');
const DummyTurn = require('./DummyTurn');

class BotTurn extends DummyTurn {
    beginTurn() {
        if (this.player.anyEffect('mustAttack') && this.canAttack()) {
            this.player.doAttack();
            return;
        }

        // shuffle hand for random?
        const fave = this.getAllActions()[0];

        if (fave) {
            this.doAction(fave);
            return;
        } else {
            const medFave = this.getAllActions({ ignoreDiceCost: true })[0];
            if (medFave) {
                // do meditation

                // this.doAction(medFave);
            }
        }
        // do an attack?
        if (this.player.canAttack()) {
            this.game.initiateAttack(this.player.opponent.phoenixborn, this.player.getAttacker());
        }

        // else no action will pass turn

    }

    doAction(fave) {
        let context = fave.createContext(this.player);
        this.game.resolveAbility(context);
    }

    getAllActions(options = {}) {
        const ignoredRequirements = options.ignoreDiceCost ? ['diceCost'] : [];
        const usableCards = [
            ...this.player.hand,
            ...this.player.spellboard,
            ...this.player.unitsInPlay
        ];
        const result = usableCards.reduce(
            (agg, card) => agg.concat(card.getLegalActions(this.player, ignoredRequirements)),
            []
        );
        return result;
    }
}

module.exports = BotTurn;
