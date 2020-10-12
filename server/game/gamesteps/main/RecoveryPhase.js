const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class RecoveryPhase extends Phase {
    constructor(game) {
        super(game, 'recovery');
        this.initialise([
            new SimpleStep(game, () => this.recoverWounds()),
            new SimpleStep(game, () => this.readyCards()),
            new SimpleStep(game, () => this.endReadyCardsStep())
        ]);
    }
    recoverWounds() {
        this.game.addMessage('All units recover wounds where able.');

        this.game.actions
            .recoverWounds()
            .resolve(this.game.cardsInPlay, this.game.getFrameworkContext());
    }

    readyCards() {
        this.game.addMessage('All units remove one exhaustion token.');

        this.game.actions.ready().resolve(this.game.cardsInPlay, this.game.getFrameworkContext());
    }

    endReadyCardsStep() {
        this.game.raiseEvent('onCardsReadied');
    }
}

module.exports = RecoveryPhase;
