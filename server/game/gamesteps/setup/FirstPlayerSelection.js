const UiPrompt = require('../uiprompt');

class FirstPlayerSelection extends UiPrompt {
    constructor(game, properties) {
        super(game);
        this.clickedButton = false;
        this.players = game.getPlayers();
        this.firstPlayer = null;
        this.properties = properties;
    }

    activePrompt(player) {
        const title = `You rolled ${this.properties.activeBasics} basics.\nYour opponent rolled ${this.properties.opponentBasics}. \nWho will go first?`
        return {
            promptTitle: 'First Player',
            menuTitle: title,
            buttons: this.players.map((p) => {
                const b = { arg: p.name, text: p.name };
                if (p === player) {
                    b.class = 'btn-primary';
                }
                return b;
            })
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

        this.game.addAlert('info', message, player);
        this.clickedButton = true;

        this.complete();

        return true;
    }

    onCompleted() {
        this.game.setGameFirstPlayer(this.firstPlayer);
    }
}

module.exports = FirstPlayerSelection;
