const AllPlayerDiscardPrompt = require('../AllPlayerDiscardPrompt.js');
const DrawPhase = require('../draw/drawphase.js');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class PreparePhase extends Phase {
    constructor(game) {
        super(game, 'prepare');
        this.initialise([
            new SimpleStep(game, () => this.rollDice()),
            new SimpleStep(game, () => this.determineFirstPlayer()),
            new AllPlayerDiscardPrompt(game),
            new DrawPhase(game)
        ]);
    }

    determineFirstPlayer() {
        this.game.determineFirstPlayer();
    }

    rollDice() {
        this.game.reRollPlayerDice();
    }
}

module.exports = PreparePhase;
