const AllPlayerPrompt = require('./allplayerprompt');

class EndGamePrompt extends AllPlayerPrompt {
    constructor(game, requestingPlayer) {
        super(game);

        this.requestingPlayer = requestingPlayer;
        this.completedPlayers = new Set([requestingPlayer]);
        this.cancelled = false;
    }

    completionCondition(player) {
        return this.cancelled || this.completedPlayers.has(player);
    }

    activePrompt() {
        return {
            menuTitle: {
                text: '{{player}} requests to end the game without loss. Allow?',
                values: { player: this.requestingPlayer.name }
            },
            buttons: [
                { arg: 'yes', text: 'Yes' },
                { arg: 'no', text: 'No' }
            ]
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to respond to your end game request'
        };
    }

    onMenuCommand(player, arg) {
        if (arg === 'yes') {
            this.game.addAlert('info', '{0} agrees to end the game', player);
            this.completedPlayers.add(player);
        } else {
            this.game.addAlert('info', '{0} did not agree to end the game', player);
            this.cancelled = true;
        }

        return true;
    }

    onCompleted() {
        if (this.cancelled) {
            return;
        }

        this.game.addAlert('danger', '{0} ends the game', this.requestingPlayer);
        this.game.endWithoutLoss();
    }
}

module.exports = EndGamePrompt;
