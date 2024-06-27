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
        // do something here...

                this.game.addAlert(
                    'info',
                    '{0} rolls {1} for behaviour:\n{2}',
                    this.player,
                    d12Roll,
                    behaviour
                );

        // default to pass (log is handled in player.endTurn)
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
