const AllPlayerPrompt = require('./allplayerprompt.js');

class ChosenDrawPrompt extends AllPlayerPrompt {
    constructor(game, properties) {
        super(game);
        let requiredDraw = {};
        game.getPlayers().forEach((p) => (requiredDraw[p.uuid] = 0)); // optional
        this.requiredDraw = properties.requiredDraw || requiredDraw;
        let defaultMax = {};
        game.getPlayers().forEach((p) => (defaultMax[p.uuid] = Math.min(2, p.deck.length)));
        this.maxValues = properties.maxValues || defaultMax;
        let prevention = {};
        game.getPlayers().forEach((p) => (prevention[p.uuid] = 0));
        this.prevention = properties.prevention || prevention; // override if passed in

        this.promptTitle = properties.promptTitle || 'Extra card draw';
        this.menuTitle = properties.menuTitle || 'Choose how many';
        this.remainderDamages = properties.remainderDamages || false;
        this.bid = {};
        this.remainder = {};
        // if max values is 0 then there's no point in asking
        for (let key in this.maxValues) {
            if (this.maxValues[key] == 0) {
                this.bid[key] = 0;
            }
        }
        this.source = properties.source;
    }

    completionCondition(player) {
        return !isNaN(this.bid[player.uuid]);
    }

    continue() {
        let completed = super.continue();

        if (completed) {
            this.game.raiseEvent('unnamedEvent', {}, () => {
                for (const player of this.game.getPlayers()) {
                    // draw cards - damage if unable
                    let message = '{0} draws {1} extra card';
                    if (this.remainderDamages && this.remainder[player.uuid] > 0) {
                        message = message + ' and takes {2} damage';
                    }
                    this.game.addMessage(
                        message,
                        player,
                        this.bid[player.uuid],
                        this.remainder[player.uuid]
                    );

                    this.game.actions
                        .draw({
                            amount: this.bid[player.uuid]
                        })
                        .resolve(player, this.game.getFrameworkContext());

                    this.remainder[player.uuid] =
                        this.requiredDraw[player.uuid] -
                        this.bid[player.uuid] -
                        this.prevention[player.uuid];

                    // after draw, and damage if unable then deal damage for the remainder
                    if (this.remainderDamages && this.remainder[player.uuid] > 0) {
                        const sourceController = this.source ? this.source.controller : null;
                        this.game.actions
                            .dealDamage({
                                amount: this.remainder[player.uuid],
                                target: player.phoenixborn
                            })
                            .resolve(player, this.game.getFrameworkContext(sourceController));

                        this.game.addMessage(
                            '{0} receives {1} damage',
                            player.phoenixborn,
                            this.remainder[player.uuid]
                        );
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
        this.bid[player.uuid] = parseInt(bid);

        return true;
    }
}

module.exports = ChosenDrawPrompt;
