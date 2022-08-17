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
            new SimpleStep(game, () => this.fatigueDamage()),
            new SimpleStep(game, () => this.additionalDraw())
        ]);
    }

    determineFirstPlayer() {
        this.game.determineFirstPlayer();
    }

    rollDice() {
        this.game.reRollPlayerDice();
    }

    drawCards() {
        const firstPlayer = this.game.roundFirstPlayer;
        this.game.actions
            .draw({ refill: true })
            .resolve(firstPlayer.opponent, this.game.getFrameworkContext());
    }

    fatigueDamage() {
        const playerShortfall = [
            this.getShortfall(this.game.roundFirstPlayer),
            this.getShortfall(this.game.roundFirstPlayer.opponent)
        ];

        let z = 0;
        while (z < 10 && playerShortfall.some((ps) => ps.shortfall > 0)) {
            for (let i = 0; i < playerShortfall.length; i++) {
                const shortfall = playerShortfall[i];
                if (shortfall.shortfall > 0) {
                    this.game.actions
                        .addDamageToken({ showMessage: true })
                        .resolve(shortfall.player.phoenixborn, this.game.getFrameworkContext());
                    shortfall.shortfall--;
                }
            }

            z++;
        }
    }

    getShortfall(player) {
        return { player: player, shortfall: 5 - player.hand.length };
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
        this.game.promptForAdditionalDraw({ maxValues: maxValues });
    }
}

module.exports = PreparePhase;
