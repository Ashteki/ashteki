const UiPrompt = require('../uiprompt');

class FirstPlayerSelection extends UiPrompt {
    constructor(game) {
        super(game);
        this.previousWinner = game.previousWinner;
        this.clickedButton = false;
        this.players = game.getPlayers();
        this.firstPlayer = null;
    }

    activePrompt() {
        return {
            promptTitle: 'First Player',
            menuTitle: 'Who will go first?',
            buttons: this.players.map((player) => ({ arg: player.name, text: player.name }))
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose first player' };
    }

    menuCommand(player, arg) {
        const otherPlayer = this.game.getOtherPlayer(player);
        let message;

        if (!otherPlayer) {
            this.firstPlayer = player;
            message = '{0} will go first';
        } else if (arg === player.name) {
            this.firstPlayer = player;
            message = '{0} chooses to go first';
        } else if (arg === otherPlayer.name) {
            this.firstPlayer = otherPlayer;
            message = '{0} chooses to go second';
        }

        this.game.addMessage(message, player);
        this.clickedButton = true;

        this.complete();

        return true;
    }

    onCompleted() {
        this.game.SetFirstPlayer(this.firstPlayer);
    }
}

module.exports = FirstPlayerSelection;
