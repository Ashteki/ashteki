const Phase = require('../phase.js');
const PinDicePrompt = require('../PinDicePrompt.js');
const SimpleStep = require('../simplestep.js');

class RecoveryPhase extends Phase {
    constructor(game) {
        super(game, 'recovery');
        this.initialise([
            new SimpleStep(game, () => this.recoverWounds()),
            new SimpleStep(game, () => this.readyAllCards()),
            new PinDicePrompt(game)
        ]);
    }

    recoverWounds() {
        this.game.addMessage('All units recover wounds where able.');

        this.game.actions
            .recoverWounds()
            .resolve(this.game.unitsInPlay, this.game.getFrameworkContext());
    }

    /** remove one exhaustion from all cards in play - battlefield, spellboard and phoenixborn */
    readyAllCards() {
        this.game.addMessage('All cards remove one exhaustion token.');
        this.game.actions.ready().resolve(this.game.cardsInPlay, this.game.getFrameworkContext());
    }
}

module.exports = RecoveryPhase;
