const BotTurn = require('../BotTurn');
const ChimeraTurn = require('../ChimeraTurn');
const DragonbornTurn = require('../DragonbornTurn');
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

        if (this.game.activePlayer.isDummy) {
            if (this.game.isChimera) {
                this.queueStep(new ChimeraTurn(this.game));
            } else if (this.game.isDragonborn) {
                this.queueStep(new DragonbornTurn(this.game));
            } else if (this.game.isBot) {
                this.queueStep(new BotTurn(this.game));
            }
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
