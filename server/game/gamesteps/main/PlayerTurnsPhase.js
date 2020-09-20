const Phase = require('../Phase');
const SimpleStep = require('../simplestep');
const ActionWindow = require('./actionwindow');

class PlayerTurnsPhase extends Phase {
    constructor(game) {
        super(game, 'playerturns');
        this.initialise([new SimpleStep(this, () => this.beginTurn())]);
    }

    beginTurn() {
        this.game.raiseEvent('onBeginTurn');
        this.game.activePlayer.beginTurn();

        this.queueStep(new ActionWindow(this.game));

        this.queueStep(new SimpleStep(this, () => this.game.raiseEndTurnEvent()));
        //todo: if ! both players pass main action carry on. otherwise end round
        this.queueStep(new SimpleStep(this, () => this.beginTurn()));
    }
}

module.exports = PlayerTurnsPhase;
