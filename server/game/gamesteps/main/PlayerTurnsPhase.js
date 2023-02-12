const DummyTurn = require('../DummyTurn');
const Phase = require('../phase');
const SimpleStep = require('../simplestep');
const ActionWindow = require('./actionwindow');

class PlayerTurnsPhase extends Phase {
    constructor(game) {
        super(game, 'playerturns');
        this.initialise([new SimpleStep(game, () => this.beginTurn())]);
    }

    beginTurn() {
        this.game.beginTurn();
        this.game.activePlayer.beginTurn();

        //TODO: switch here for Chimera turn
        if (this.game.solo && this.game.activePlayer.isDummy) {
            this.queueStep(new DummyTurn(this.game))
        } else {
            this.queueStep(new ActionWindow(this.game));
        }

        this.queueStep(new SimpleStep(this.game, () => this.game.raiseEndTurnEvent()));
        this.queueStep(new SimpleStep(this.game, () => this.queueNextTurn()));
    }

    queueNextTurn() {
        if (this.game.activePlayer.passedMain && this.game.activePlayer.opponent.passedMain) {
            this.game.addAlert('info', 'Both players passed their main action.');
        } else {
            this.game.switchActivePlayer();
            this.queueStep(new SimpleStep(this.game, () => this.beginTurn()));
        }
    }
}

module.exports = PlayerTurnsPhase;
