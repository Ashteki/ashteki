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
        if (this.player.threatZone.length) {
            this.doBehaviourRoll();
        } else if (this.canAttack()) {
            // attack

        }
        else {
            // pass
        }
    }

    doBehaviourRoll() {
        // roll behaviour dice and determine 
        const d12Roll = Dice.d12Roll();
        this.game.addMessage('{0} rolls {1} for behaviour', this.player, d12Roll)
        this.player.behaviourRoll = d12Roll;
        const context = this.game.getFrameworkContext(this.player);
        this.game.queueUserAlert(context, {
            promptTitle: 'Chimera roll',
            menuTitle: 'Chimera rolled for behaviour: ' + d12Roll,
        })
        // get actions from behaviour card and queue
        const behaviour = this.player.behaviour;
        const handlers = behaviour.getChimeraHandlers(d12Roll);
        handlers.forEach(h => {
            this.queueStep(new SimpleStep(this.game, h));
        });
    }

    canAttack() {
        return !!this.player.canAttack();
    }
}

module.exports = DummyTurn;