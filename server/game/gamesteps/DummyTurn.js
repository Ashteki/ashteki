const { Level } = require("../../constants");
const AbilityDsl = require("../abilitydsl");
const Dice = require("../dice");
const BaseStepWithPipeline = require("./basestepwithpipeline");
const SimpleStep = require("./simplestep");

class DummyTurn extends BaseStepWithPipeline {
    constructor(game) {
        super(game);
        this.player = game.activePlayer
        // set up some steps
        this.pipeline.initialise([new SimpleStep(game, () => this.beginTurn())]);
    }

    beginTurn() {
        if (this.player.threatCards.length) {
            this.rollDice();
        } else if (this.canAttack()) {
            // attack
            this.player.doAttack();
        }
        else {
            // pass
        }
    }

    rollDice() {
        // queue an action because of redrains trigger
        const basicDie = this.player.dice.find(die => die.level === Level.Basic);
        const result = AbilityDsl.actions.rerollDice({ target: basicDie })
            .resolve(basicDie, this.game.getFrameworkContext(this.player));

        this.queueStep(new SimpleStep(this.game, () => {
            const rolledDie = result.event.childEvent.dice[0];
            const cloneDie = result.event.childEvent.diceCopy[0];
            const d12Roll = Dice.d12Roll();
            // roll behaviour dice and determine 
            this.game.addMessage('{0} rolls {1} for behaviour', this.player, d12Roll)
            this.player.behaviourRoll = d12Roll;
            const context = this.game.getFrameworkContext(this.player);
            this.game.queueUserAlert(context, {
                style: 'danger',
                promptTitle: 'Chimera Reveal',
                menuTitle: 'Chimera rolls a rage die and d12\n\n Behaviour: ' + d12Roll,
                controls: [
                    {
                        type: 'targeting',
                        source: cloneDie.getShortSummary(),
                        targets: [rolledDie.getShortSummary()]// [this.attack.target.getShortSummary()]
                    }
                ]
            });
            // get actions from behaviour card and queue
            const behaviour = this.player.behaviour;
            behaviour.handleBehaviourRoll(d12Roll);
        }))
    }

    canAttack() {
        return !!this.player.canAttack();
    }

    getAttacker() {
        // from left to right, not exhausted / canAttack
        return this.player.unitsInPlay.find(u => u.canAttack());
    }

    getTarget(attacker) {
        return this.player.opponent.phoenixborn;
    }
}

module.exports = DummyTurn;