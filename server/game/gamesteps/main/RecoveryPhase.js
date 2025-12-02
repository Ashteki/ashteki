const { CardType } = require('../../../constants.js');
const Phase = require('../phase.js');
const PinDicePrompt = require('../PinDicePrompt.js');
const SimpleStep = require('../simplestep.js');

class RecoveryPhase extends Phase {
    constructor(game) {
        super(game, 'recovery');
        this.initialise([
            new SimpleStep(game, () => this.recoverWounds()),
            new SimpleStep(game, () => this.removeRedRains()),
            new SimpleStep(game, () => this.removeExhaustion()),
            new SimpleStep(game, () => this.removeHostedDice()),
            new PinDicePrompt(game),
            new SimpleStep(game, () => this.replenishAspects()),
            new SimpleStep(game, () => this.placeRedRains()),
            new SimpleStep(game, () => this.replenishAspectStatusTokens())
        ]);
    }

    recoverWounds() {
        this.game.addMessage('All units recover wounds where able.');

        this.game.actions
            .recoverWounds()
            .resolve(this.game.unitsInPlay, this.game.getFrameworkContext());
    }

    removeRedRains() {
        if (!this.game.solo) {
            return;
        }

        const dummyPlayer = this.game.getDummyPlayer();
        // remove 1 Red Rains token from the Chimera for each exhaustion token on the Chimera or Ultimate cards. 
        const totalExhaustion = dummyPlayer.chimera.exhaustion + dummyPlayer.ultimate.exhaustion;
        if (totalExhaustion > 0 && dummyPlayer.chimera.redRains) {
            const amt = Math.min(totalExhaustion, dummyPlayer.chimera.redRains);
            this.game.addMessage('Chimera removes {0} red rains tokens for being exhausted', amt);
            const context = this.game.getFrameworkContext(dummyPlayer);
            context.source = dummyPlayer.chimera;
            this.game.actions
                .removeRedRains({ amount: amt, showMessage: true, shortMessage: true })
                .resolve(dummyPlayer.phoenixborn, context);
        }
    }

    /** remove one exhaustion from all cards in play - battlefield, spellboard and phoenixborn */
    removeExhaustion() {
        this.game.addMessage('All cards remove one exhaustion token.');
        const upgrades = this.game.cardsInPlay.reduce(
            (acc, c) => (c.upgrades ? acc.concat(c.upgrades) : acc),
            []
        );
        this.game.actions
            .ready()
            .resolve(this.game.cardsInPlay.concat(upgrades), this.game.getFrameworkContext());
        return;
    }

    removeHostedDice() {
        this.game.addMessage('All hosted dice are exhausted.');
        const upgrades = this.game.cardsInPlay.reduce(
            (acc, c) => (c.upgrades ? acc.concat(c.upgrades) : acc),
            []
        );
        const allCardsInPlay = this.game.cardsInPlay.concat(upgrades);
        const hostedDice = allCardsInPlay.reduce(
            (acc, c) => (c.dieUpgrades ? acc.concat(c.dieUpgrades) : acc),
            []
        )
        this.game.actions
            .detachDie()
            .resolve(hostedDice, this.game.getFrameworkContext());
        return;
    }

    placeRedRains() {
        if (!this.game.solo) {
            return;
        }

        const dummyPlayer = this.game.getDummyPlayer();
        // Place 1 Red Rains token on the Chimera for each aspect in play, resolving the Ultimate card, if applicable
        const aspectCount = dummyPlayer.getAspectsInPlay().length;
        this.game.addMessage('Chimera receives {0} red rains tokens for Aspects in play', aspectCount)
        this.game.actions
            .addRedRainsToken({ amount: aspectCount, showMessage: true, shortMessage: true })
            .resolve(dummyPlayer.phoenixborn, this.game.getFrameworkContext(dummyPlayer));
    }

    replenishAspects() {
        if (!this.game.solo) {
            return;
        }

        // Add face down aspect cards to the Chimera’s battlefield(s)
        // until each battlefield has a number of aspect cards equal to its threat value
        // (face up or face down)    
        const dummy = this.game.getDummyPlayer();
        dummy.replenishAspects();
    }

    replenishAspectStatusTokens() {
        if (!this.game.solo) {
            return;
        }

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
}

module.exports = RecoveryPhase;
