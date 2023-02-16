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
            this.game.addMessage('Chimera has facedown aspects. Rolling for behaviour.')
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

        // get actions from behaviour card and queue
        const behaviour = this.player.behaviour;
        const actions = behaviour.getChimeraActions(d12Roll);
        actions.forEach(a => {
            const context = a.createContext(this.player);
            this.queueStep(new SimpleStep(this.game, () => this.game.resolveAbility(context)));
        });
    }

    canAttack() {
        return !!this.player.cardsInPlay.length;
    }
}

module.exports = DummyTurn;