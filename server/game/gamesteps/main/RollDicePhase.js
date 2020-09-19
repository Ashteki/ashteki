const Phase = require('../Phase.js');
const SimpleStep = require('../simplestep.js');
const _ = require('underscore');
// const Dice = require('../../dice.js')

class RollDicePhase extends Phase {
    constructor(game, options) {
        super(game, 'rolldice');
        this.options = options;
        this.initialise([new SimpleStep(game, () => this.rollDice())]);
    }

    rollDice() {
        if (this.options.allPlayers) {
            _.each(this.game.getPlayers(), (player) => {
                this.rollPlayerDice(player);
            });
        } else {
            this.rollPlayerDice(this.game.activePlayer);
        }
    }

    rollPlayerDice(player) {
        if (player)
            // player.dice = Dic
            return true;
    }
}

module.exports = RollDicePhase;
