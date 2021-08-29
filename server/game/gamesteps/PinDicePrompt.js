const { Level } = require('../../constants');
const AllPlayerPrompt = require('./allplayerprompt');

class PinDicePrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.selectedDice = {};
        this.selectableDice = {};
        game.getPlayers().forEach((player) => {
            this.selectedDice[player.name] = [];
        });

        this.powerDiceSelected = false;
    }

    completionCondition(player) {
        return player.recoveryDicePinned;
    }

    continue() {
        if (!this.powerDiceSelected) {
            this.selectPowerDice();
        }

        if (!this.isComplete()) {
            this.highlightSelectableDice();
        }

        return super.continue();
    }

    selectPowerDice() {
        this.game.getPlayers().forEach((player) => {
            this.selectedDice[player.name] = player.dice.filter(
                (d) => this.dieCondition(d) && d.level === Level.Power
            );
            player.setSelectedDice(this.selectedDice[player.name]);
        });

        this.powerDiceSelected = true;
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
            if (!player.recoveryDicePinned) {
                if (!this.selectableDice[player.name]) {
                    this.selectableDice[player.name] = player.dice.filter((d) =>
                        this.dieCondition(d)
                    );
                }
                player.setSelectableDice(this.selectableDice[player.name]);
            }
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
                '{0} keeps {1} dice{2}{3}',
                player,
                this.selectedDice[player.name].length,
                this.selectedDice[player.name].length > 0 ? ' : ' : '',
                this.selectedDice[player.name]
            );

            player.clearSelectedDice();
            player.clearSelectableDice();
            return true;
        }
        return false;
    }
}

module.exports = PinDicePrompt;
