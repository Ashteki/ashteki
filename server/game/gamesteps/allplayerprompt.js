const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');

class AllPlayerPrompt extends UiPrompt {
    activeCondition(player) {
        return !this.completionCondition(player);
    }

    // eslint-disable-next-line no-unused-vars
    completionCondition(player) {
        return false;
    }

    isComplete() {
        return _.all(this.game.getPlayers(), (player) => {
            return this.completionCondition(player);
        });
    }

    setPrompt() {
        _.each(this.game.getPlayers(), (player) => {
            if (this.activeCondition(player)) {
                player.setPrompt(this.addDefaultCommandToButtons(this.activePrompt(player)));
                if (!this.game.finishedAt) {
                    player.startClock();
                }
            } else if (player.opponent.isDummy && this.activeCondition(player.opponent)) {
                const prompt = this.activePrompt(player.opponent);
                prompt.promptTitle = 'CHIMERA CHOICE';
                prompt.style = 'danger';
                player.setPrompt(this.addDefaultCommandToButtons(prompt));
            } else {
                player.setPrompt(this.waitingPrompt());
            }
        });
    }

    onMenuCommand(player, arg, uuid, method) {
        if (uuid !== this.uuid) {
            return false;
        }

        if (this.actingForOpponent(player)) {
            return this.menuCommand(player.opponent, arg, method);
        }

        if (!this.activeCondition(player)) {
            return false;
        }

        return this.menuCommand(player, arg, method);
    }

    actingForOpponent(player) {
        return (
            player.opponent.isDummy &&
            !this.activeCondition(player) &&
            this.activeCondition(player.opponent)
        );
    }
}

module.exports = AllPlayerPrompt;
