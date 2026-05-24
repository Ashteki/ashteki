const Phase = require('../phase');
const SimpleStep = require('../simplestep');

class DragonPhase extends Phase {
    constructor(game) {
        super(game, 'dragon');
        this.initialise([
            new SimpleStep(game, () => this.cleanse()),
            new SimpleStep(game, () => this.gainStatus()),
            new SimpleStep(game, () => this.replenishAspects()),
            new SimpleStep(game, () => this.replenishAspectStatusTokens()),
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

    replenishAspectStatusTokens() {
        // For any aspects with status abilities, if they have
        // fewer status tokens on them than there are pips on their status ability, refill
        // their status tokens until they are equal to the number of pips
        const dummy = this.game.getDummyPlayer();
        for (const aspect of dummy.getAspectsInPlay()) {
            if (aspect.status < aspect.statusCount) {
                aspect.tokens.status = aspect.statusCount;
            }
        }
        this.game.addMessage('All aspects replenish status tokens.');
    }

    progress() {
        const dummyPlayer = this.game.getDummyPlayer();
        dummyPlayer.triggerProgressAbility();
        this.game.queueSimpleStep(() => {
            const dummy = this.game.getDummyPlayer();
            dummy.advanceChimeraPhase();
        });
    }
}

module.exports = DragonPhase;
