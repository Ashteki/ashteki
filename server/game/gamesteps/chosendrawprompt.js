const AllPlayerPrompt = require('./allplayerprompt.js');

class ChosenDrawPrompt extends AllPlayerPrompt {
    constructor(game, properties) {
        super(game);
        let defaultMax = {};
        game.getPlayers().forEach((p) => (defaultMax[p.uuid] = properties.globalMax || 2));
        this.maxValues = properties.maxValues || defaultMax;
        let prevention = {};
        game.getPlayers().forEach((p) => (prevention[p.uuid] = 0));
        this.prevention = properties.prevention || prevention;

        this.promptTitle = properties.promptTitle || 'Draw cards';
        this.menuTitle = properties.menuTitle || 'Choose a number';
        this.remainderDamages = properties.remainderDamages || false;
        this.bid = {};
        this.remainder = {};
        // if max values is 0 then there's no point in asking...
        for (let key in this.maxValues) {
            if (this.maxValues[key] == 0) {
                this.bid[key] = 0;
            }
        }
    }

    completionCondition(player) {
        return !isNaN(this.bid[player.uuid]);
    }

    continue() {
        let completed = super.continue();

        if (completed) {
            this.game.raiseEvent('unnamedEvent', {}, () => {
                for (const player of this.game.getPlayers()) {
                    this.remainder[player.uuid] =
                        this.maxValues[player.uuid] -
                        this.bid[player.uuid] -
                        this.prevention[player.uuid];
                    this.game.actions
                        .draw({
                            amount: this.bid[player.uuid],
                            damageIfEmpty: true
                        })
                        .resolve(player, this.game.getFrameworkContext());

                    if (this.remainderDamages && this.remainder[player.uuid] > 0) {
                        this.game.actions
                            .dealDamage({
                                amount: this.remainder[player.uuid],
                                target: player.phoenixborn
                            })
                            .resolve(player, this.game.getFrameworkContext());
                    }
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

    menuCommand(player, bid) {
        let message = '{0} draws {1} extra card';
        if (this.remainderDamages && this.remainder[player.uuid] > 0) {
            message = message + ' and takes {2} damage';
        }
        this.game.addMessage(message, player, bid, this.remainder[player.uuid]);

        this.bid[player.uuid] = parseInt(bid);

        return true;
    }
}

module.exports = ChosenDrawPrompt;
