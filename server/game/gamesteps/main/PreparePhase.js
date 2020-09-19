const DrawPhase = require('../draw/drawphase.js');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');
const RollDicePhase = require('./rollDicePhase.js');

class PreparePhase extends Phase {
    constructor(game) {
        super(game, 'prepare');
        this.initialise([
            new RollDicePhase(game, { allPlayers: true }),
            new SimpleStep(game, () => this.discardCards()), // actionwindow?
            new DrawPhase(game)
        ]);
    }

    discardCards() {
        // queue up a discard prompt / action window?
        // throw new Error('Method not implemented.');
    }
}

module.exports = PreparePhase;
