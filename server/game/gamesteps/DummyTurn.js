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

        if (this.player.threatCards.length) {
            this.rollDice();
        } else if (this.canAttack()) {
            // attack
            this.player.doAttack();
        } else {
            // pass
        }
    }

    rollDice() {
        // Reroll a basic die
        // queue an action because of redrains trigger
        const basicDie = this.player.dice.find((die) => die.level === Level.Basic);
        const result = AbilityDsl.actions
            .rerollDice({ target: basicDie })
            .resolve(basicDie, this.game.getFrameworkContext(this.player));

        // Roll for behaviour
        this.queueStep(
            new SimpleStep(this.game, () => {
                const d12Roll = Dice.d12Roll();
                // roll behaviour dice and determine
                this.game.addMessage('{0} rolls {1} for behaviour', this.player, d12Roll);
                this.player.behaviourRoll = d12Roll;
                const context = this.game.getFrameworkContext(this.player);

                const rolledRageDie = result.event.childEvent.dice[0];
                const clonedRageDie = result.event.childEvent.diceCopy[0];
                // get actions from behaviour card and queue
                const behaviour = this.player.behaviour.getBehaviour(
                    d12Roll,
                    this.player.chimeraPhase
                );

                this.game.queueUserAlert(context, {
                    style: 'danger',
                    promptTitle: 'Chimera Turn',
                    menuTitle: 'Chimera rolls rage and behavior dice',
                    controls: [
                        {
                            type: 'targeting',
                            source: clonedRageDie.getShortSummary(),
                            targets: [rolledRageDie.getShortSummary()] // [this.attack.target.getShortSummary()]
                        },
                        {
                            type: 'behaviour',
                            behaviour: behaviour.getShortSummary()
                        }
                    ]
                });
                // behaviourCard.handleBehaviourRoll(d12Roll);
                behaviour.execute();
            })
        );
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
