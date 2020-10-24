const AllPlayerDiscardPrompt = require('../AllPlayerDiscardPrompt.js');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class PreparePhase extends Phase {
    constructor(game) {
        super(game, 'prepare');
        this.initialise([
            new SimpleStep(game, () => this.rollDice()),
            new SimpleStep(game, () => this.determineFirstPlayer()),
            new AllPlayerDiscardPrompt(game),
            new SimpleStep(game, () => this.drawCards())
        ]);
    }

    determineFirstPlayer() {
        this.game.determineFirstPlayer();
    }

    rollDice() {
        this.game.reRollPlayerDice();
    }

    // refill hand - cause damage in draw phase if unable to draw
    drawCards() {
        // this.game.raiseEvent('onPreparePhaseDraw', {}, () => {
        this.game.actions
            .draw({ refill: true, damageIfEmpty: true, singleCopy: true })
            .resolve(this.game.getPlayers(), this.game.getFrameworkContext());
        // });
    }
}

module.exports = PreparePhase;
