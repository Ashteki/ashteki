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
        // roll behaviour dice and determine 
        const d12Roll = Dice.d12Roll();
        this.player.behaviourRoll = d12Roll;

        // get actions from behaviour card and queue
        const behaviour = this.player.behaviour;
        const actions = behaviour.getChimeraActions(d12Roll);
        actions.forEach(a => {
            const context = a.createContext(this.player);
            this.queueStep(new SimpleStep(this.game, () => this.game.resolveAbility(context)));
        })
    }

}

module.exports = DummyTurn;