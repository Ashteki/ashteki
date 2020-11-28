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
            new SimpleStep(game, () => this.drawCards()),
            new SimpleStep(game, () => this.additionalDraw())
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
        this.game.actions
            .draw({ refill: true, damageIfEmpty: true, singleCopy: true })
            .resolve(this.game.getPlayers(), this.game.getFrameworkContext());
    }

    additionalDraw() {
        if (!this.game.getPlayers().some((p) => p.sumEffects('additionalDraw') > 0)) {
            return true;
        }

        // prompt players for extra draw
        let maxValues = {};
        for (const player of this.game.getPlayers()) {
            maxValues[player.uuid] = player.sumEffects('additionalDraw');
        }
        this.game.promptForAdditionalDraw(maxValues);
    }
}

module.exports = PreparePhase;
