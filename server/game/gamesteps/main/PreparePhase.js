const DrawPhase = require('../draw/drawphase.js');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class PreparePhase extends Phase {
    constructor(game) {
        super(game, 'prepare');
        this.initialise([
            new SimpleStep(game, () => this.rollDice()),
            new SimpleStep(game, () => this.determineFirstPlayer()),
            new SimpleStep(game, () => this.discardCards()), // actionwindow? prompt?
            new DrawPhase(game)
        ]);
    }

    determineFirstPlayer() {
        this.game.determineFirstPlayer();
    }

    rollDice() {
        this.game.reRollPlayerDice();
    }

    discardCards() {
        // queue up a discard prompt / action window?
        // throw new Error('Method not implemented.');
    }
}

module.exports = PreparePhase;
