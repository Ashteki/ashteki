class AuditHelper {
    constructor(game) {
        this.game = game;

        this.audit = [];
    }

    snapshotState(type) {
        const activePlayer = this.game.activePlayer;

        // e.g. no activePlayer if the game hasn't started past FF
        if (activePlayer) {
            this.audit.push({
                type: type,
                round: this.game.round,
                activePlayer: activePlayer.username,
                playerTurn: activePlayer.turn,
                playerState: this.game.getPlayers().map((player) => ({
                    turn: player.turn,
                    wounds: player.phoenixborn.damage,
                    unitCount: player.unitsInPlay.length,
                    diceUnspent: player.dice.filter((d) => !d.exhausted).length,
                    cardsPlayed: this.game.gameLog.filter(
                        (l) => l.player === player && l.act === 'play'
                    ).length,
                    medCount: player.medCount,
                    deck: player.deck.length,
                    hand: player.hand.length
                }))
            });
        }
    }

    getReport() {
        return this.audit;
    }
}

module.exports = AuditHelper;
