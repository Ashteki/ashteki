const Phase = require('../phase');
const SimpleStep = require('../simplestep');

class DragonPhase extends Phase {
    constructor(game) {
        super(game, 'dragon');
        this.initialise([
            new SimpleStep(game, () => this.cleanse()),
            new SimpleStep(game, () => this.gainStatus()),
            new SimpleStep(game, () => this.replenishAspects()),
            new SimpleStep(game, () => this.progress())
        ]);
    }

    cleanse() {
        const dummyPlayer = this.game.getDummyPlayer();
        const context = this.game.getFrameworkContext(dummyPlayer);
        const aliens = dummyPlayer.getTresspassingCards();
        if (aliens.length) {
            this.game.actions.discard().resolve(aliens, context);
        }
    }

    gainStatus() {
        const dummyPlayer = this.game.getDummyPlayer();
        const aspectCount = dummyPlayer.getAspectsInPlay().length;
        this.game.addMessage(
            'Dragonborn receives 1 status token for each face up aspect',
            aspectCount
        );
        this.game.actions
            .addStatusToken({ amount: aspectCount, showMessage: true, shortMessage: true })
            .resolve(dummyPlayer.phoenixborn, this.game.getFrameworkContext(dummyPlayer));
    }

    replenishAspects() {
        const dummy = this.game.getDummyPlayer();
        dummy.replenishAspects();
    }

    progress() {
        const dummyPlayer = this.game.getDummyPlayer();
        dummyPlayer.triggerProgressAbility();
    }
}

module.exports = DragonPhase;
