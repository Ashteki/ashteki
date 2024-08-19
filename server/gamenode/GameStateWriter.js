const AnonymousSpectator = require('../game/anonymousspectator');
const PlayerStateWriter = require('./PlayerStateWriter');

class GameStateWriter {
    constructor(game) {
        this.game = game;
        this.cardVisibility = game.cardVisibility;
    }

    getStateForPlayer(player) {
        return this.getState(player.name);
    }

    getStateForReplay() {
        return this.getState(null, { replay: true });
    }

    /**
     * This information is sent to the client
     */
    getState(userName, options = { replay: false }) {
        const userPlayer = this.game.playersAndSpectators[userName] || new AnonymousSpectator();
        const playerState = {};
        const playerOptions = {
            deckNotes: this.game.currentPhase === 'setup'
        };

        if (this.game.started) {
            for (const player of this.game.getPlayers()) {
                playerState[player.name] = new PlayerStateWriter(
                    player,
                    this.cardVisibility,
                    this.game.solo,
                    options.replay
                ).getState(userPlayer, this.game.activePlayer, playerOptions);
                playerState[player.name].connected = !!player.socket;
            }

            const result = {
                cardLog: this.game.gameLog.map((i) => ({
                    type: i.act,
                    obj: i.obj.getShortSummary(),
                    p: i.player?.name
                })),
                currentPhase: this.game.currentPhase,
                round: this.game.round,
                // activePlayerTurn: activePlayer.turn,
                id: this.game.id,
                name: this.game.name,
                label: this.game.label,
                solo: this.game.solo,
                owner: this.game.owner,
                players: playerState,
                spectators: this.game.getSpectators().map((spectator) => {
                    return {
                        id: spectator.id,
                        name: spectator.name
                    };
                }),
                // game options
                gameFormat: this.game.gameFormat,
                gamePrivate: this.game.gamePrivate,
                muteSpectators: this.game.muteSpectators,
                openHands: this.game.openHands,
                showHand: this.game.showHand,
                useGameTimeLimit: this.game.useGameTimeLimit,
                clockType: this.game.clockType,

                started: this.game.started,
                finishedAt: this.game.finishedAt,

                swap: this.game.swap,
                manualMode: this.game.manualMode,
                messages: this.game.gameChat.messages,
                attack: this.game.attackState ? this.game.attackState.getSummary() : null,
                winner: this.game.winner ? this.game.winner.name : undefined
            };

            if (this.game.useGameTimeLimit && this.game.timeLimit) {
                this.game.timeLimit.checkForTimeLimitReached();
                result.gameTimeLimitStarted = this.game.timeLimit.started;
                result.gameTimeLimitStartedAt = this.game.timeLimit.startedAt;
                result.gameTimeLimit = this.game.timeLimit.timeLimitInMinutes;
            }
            return result;
        }

        return this.game.getSummary();
    }
}

module.exports = GameStateWriter;
