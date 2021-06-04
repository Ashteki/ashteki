const AllPlayerPrompt = require('./allplayerprompt');
const { Level } = require('../../constants');

class PinDicePrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.selectedDice = {};
        this.selectableDice = {};
        game.getPlayers().forEach((player) => {
            this.selectedDice[player.name] = [];
        });
    }

    completionCondition(player) {
        return player.recoveryDicePinned;
    }

    continue() {
        if (!this.isComplete()) {
            this.highlightSelectableDice();
        }

        return super.continue();
    }

    activePrompt() {
        return {
            selectCard: true,
            menuTitle: 'Select dice to keep',
            buttons: [{ text: 'Done', arg: 'done' }],
            promptTitle: 'Recovery phase'
        };
    }

    highlightSelectableDice() {
        this.game.getPlayers().forEach((player) => {
            if (!this.selectableDice[player.name]) {
                this.selectableDice[player.name] = player.dice.filter((d) => this.dieCondition(d));
            }
            player.setSelectableDice(this.selectableDice[player.name]);

            if (!this.selectedDice[player.name]) {
                this.selectedDice[player.name] = this.selectableDice[player.name].filter(
                    (d) => d.level === Level.Power
                );
            }
            player.setSelectedDice(this.selectedDice[player.name]);
        });
    }

    dieCondition(die) {
        return !die.exhausted;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to pin dice' };
    }

    onDieClicked(player, die) {
        if (!player || !this.activeCondition(player) || !die) {
            return false;
        }
        if (!this.dieCondition(die)) {
            return false;
        }

        if (!this.selectedDice[player.name].includes(die)) {
            this.selectedDice[player.name].push(die);
        } else {
            this.selectedDice[player.name] = this.selectedDice[player.name].filter(
                (c) => c !== die
            );
        }
        player.setSelectedDice(this.selectedDice[player.name]);
    }

    menuCommand(player, arg) {
        if (arg === 'done') {
            player.pinSelectedDice();

            this.game.addMessage(
                '{0} keeps {1} dice',
                player,
                this.selectedDice[player.name].length
            );

            player.clearSelectedDice();
            player.clearSelectableDice();
            return true;
        }
        return false;
    }
}

module.exports = PinDicePrompt;
