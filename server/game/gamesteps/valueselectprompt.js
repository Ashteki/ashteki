const AllPlayerPrompt = require('./allplayerprompt.js');

class ValueSelectPrompt extends AllPlayerPrompt {
    constructor(game, maxValues, menuTitle, promptTitle) {
        super(game);
        this.maxValues = maxValues;
        this.promptTitle = promptTitle || 'How many';
        this.menuTitle = menuTitle || 'Choose a number';
        this.bid = {};
        for (let key in maxValues) {
            if (this.maxValues[key] == 0) {
                this.bid[key] = 0;
            }
        }
    }

    activeCondition(player) {
        return isNaN(this.bid[player.uuid]);
    }

    completionCondition(player) {
        return !isNaN(this.bid[player.uuid]);
    }

    continue() {
        let completed = super.continue();

        if (completed) {
            this.game.raiseEvent('unnamedEvent', {}, () => {
                for (const player of this.game.getPlayers()) {
                    this.game.actions
                        .draw({
                            amount: this.bid[player.uuid],
                            damageIfEmpty: true
                        })
                        .resolve(player, this.game.getFrameworkContext());
                }
            });
        }

        return completed;
    }

    activePrompt(player) {
        let buttons = [];
        for (let i = 0; i <= this.maxValues[player.uuid]; i++) {
            buttons.push(i.toString());
        }

        return {
            promptTitle: this.promptTitle,
            menuTitle: this.menuTitle,
            buttons: buttons.map((num) => ({ text: num, arg: num }))
        };
    }

    waitingPrompt() {
        return { menuTitle: "Waiting for opponent's additional draw." };
    }

    menuCommand(player, bid) {
        this.game.addMessage('{0} draws {1} extra.', player, bid);

        this.bid[player.uuid] = parseInt(bid);

        return true;
    }
}

module.exports = ValueSelectPrompt;
