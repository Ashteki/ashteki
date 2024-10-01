const AllPlayerDiscardPrompt = require('../AllPlayerDiscardPrompt.js');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class PreparePhase extends Phase {
    constructor(game) {
        super(game, 'prepare');
        this.initialise([
            new SimpleStep(game, () => this.rollDice()),
            new SimpleStep(game, () => this.determineFirstPlayer()),
            new SimpleStep(game, () => this.saveReplayState()),
            new AllPlayerDiscardPrompt(game),
            new SimpleStep(game, () => this.drawCards()),
            new SimpleStep(game, () => this.fatigueDamage()),
            new SimpleStep(game, () => this.additionalDraw())
        ]);
    }

    saveReplayState() {
        this.game.saveReplayState('prepare');
    }

    determineFirstPlayer() {
        this.game.determineFirstPlayer();
    }

    rollDice() {
        this.game.reRollPlayerDice();
        this.game.unpinPlayerDice();
    }

    drawCards() {
        const players = [this.game.roundFirstPlayer, this.game.roundFirstPlayer.opponent];
        players.forEach(p => {
            if (!p.isDummy) {
                this.game.actions
                    .draw({ refill: true })
                    .resolve(p, this.game.getFrameworkContext());
            }
        });
    }

    fatigueDamage() {
        if (!this.game.disableFatigue) {
            const playerShortfall = [];
            const players = [this.game.roundFirstPlayer, this.game.roundFirstPlayer.opponent];
            players.forEach((player) => {
                if (!player.isDummy) {
                    const shortfall = { player: player, shortfall: 5 - player.hand.length };
                    playerShortfall.push(shortfall);
                }
            });

            let z = 0;
            while (z < 10 && playerShortfall.some((ps) => ps.shortfall > 0)) {
                for (let i = 0; i < playerShortfall.length; i++) {
                    const shortfall = playerShortfall[i];
                    if (shortfall.shortfall > 0) {
                        const pb = shortfall.player.phoenixborn;
                        this.game.addMessage('{0} receives 1 fatigue damage', pb);
                        this.game.actions
                            .addDamageToken()
                            .resolve(pb, this.game.getFrameworkContext());
                        shortfall.shortfall--;
                    }
                }

                z++;
            }
        }
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
