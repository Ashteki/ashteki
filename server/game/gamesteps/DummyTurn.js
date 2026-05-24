const { Level } = require('../../constants');
const AbilityDsl = require('../abilitydsl');
const Dice = require('../dice');
const BaseStepWithPipeline = require('./basestepwithpipeline');
const SimpleStep = require('./simplestep');

class DummyTurn extends BaseStepWithPipeline {
    constructor(game) {
        super(game);
        this.player = game.activePlayer;
        // set up some steps
        this.pipeline.initialise([new SimpleStep(game, () => this.beginTurn())]);
    }

    beginTurn() {
        if (this.player.anyEffect('mustAttack') && this.canAttack()) {
            this.player.doAttack();
            return;
        }

        this.queueActions();
    }

    queueActions() {
        return;
    }

    getChatMessage(behaviour) {
        const textArray = Object.values(behaviour.text);
        return textArray.join('\n');
    }

    canAttack() {
        return !!this.player.canAttack();
    }

    getAttacker() {
        // from left to right, not exhausted / canAttack
        return this.player.unitsInPlay.find((u) => u.canAttack());
    }

    getTarget(attacker) {
        return this.player.opponent.phoenixborn;
    }
}

module.exports = DummyTurn;
