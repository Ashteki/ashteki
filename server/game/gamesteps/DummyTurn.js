const Dice = require("../dice");
const BaseStepWithPipeline = require("./basestepwithpipeline");
const SimpleStep = require("./simplestep");

class DummyTurn extends BaseStepWithPipeline {
    constructor(game) {
        super(game);
        this.activePlayer = game.activePlayer
        // set up some steps
        this.pipeline.initialise([new SimpleStep(this, () => this.beginTurn())]);
    }

    beginTurn() {
        // roll behaviour dice and determine 
        const d12Roll = Dice.d12Roll();
        this.activePlayer.behaviourRoll = d12Roll;

        // get actions from behaviour card?
        // need an ability here - get an array of abilities (side and main cost) from behaviour roll
        // queue them up with abilityresolver as steps in pipeline
        // ££

        // // play a card if you can
        // for (const card of this.activePlayer.hand) {
        //     if (card.canPlay(this.activePlayer)) {
        //         const actions = card.getLegalActions(this.activePlayer);

        //         let context = actions[0].createContext(this.activePlayer);
        //         this.game.resolveAbility(context);

        //         break;
        //     }
        // }
    }

}

module.exports = DummyTurn;