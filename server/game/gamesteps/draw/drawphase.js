const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([new SimpleStep(game, () => this.drawCards())]);
    }

    // refill hand - cause damage in draw phase if unable to draw
    drawCards() {
        this.game.actions
            .draw({ refill: true, damageIfEmpty: true, singleCopy: true })
            .resolve(this.game.getPlayers(), this.game.getFrameworkContext());
    }
}

module.exports = DrawPhase;
