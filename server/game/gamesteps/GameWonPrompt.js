const AllPlayerPrompt = require('./allplayerprompt');
const RematchPrompt = require('./RematchPrompt');

class GameWonPrompt extends AllPlayerPrompt {
    constructor(game, winner) {
        super(game);
        this.winner = winner;
        this.clickedButton = {};
    }

    completionCondition(player) {
        return !!this.clickedButton[player.name];
    }

    activePrompt() {
        let menuTitle = {
            text: 'The game has ended',
            values: []
        };
        if (this.winner) {
            menuTitle = {
                text: '{{player}} has won the game!',
                values: { player: this.winner.name }
            };
        }

        const promptButtons = [{ command: 'leavegame', arg: 'leavegame', text: 'Leave' }];
        if (!this.game.solo) {
            promptButtons.push({ arg: 'rematch', text: 'Rematch' });
            promptButtons.push({ arg: 'rematch-swap', text: 'Rematch: Swap Decks' });
        }
        return {
            promptTitle: 'Game Won',
            menuTitle: menuTitle,
            buttons: promptButtons
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose to continue' };
    }

    menuCommand(player, arg) {
        let message = '';
        switch (arg) {
            case 'rematch':
                message = 'a rematch';
                break;
            case 'rematch-swap':
                message = 'a rematch and swap decks';
                break;
            case 'leave':
                leaveGame(this.game.id);
                return true;
        }

        this.game.addMessage('{0} would like {1}', player, message);

        this.clickedButton[player.name] = true;

        if (arg === 'rematch') {
            this.game.queueStep(new RematchPrompt(this.game, player));

            return true;
        }

        if (arg === 'rematch-swap') {
            this.game.swap = !this.game.swap;
            this.game.queueStep(new RematchPrompt(this.game, player));

            return true;
        }


        return true;
    }
}

module.exports = GameWonPrompt;
