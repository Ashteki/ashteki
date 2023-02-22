const Dice = require("../dice");

class ChimeraDefenceStrategy {
    constructor(player, game) {
        this.player = player;
        this.game = game;
    }

    execute(attack) {
        //TODO: if defenders are on the battlefield, unit guard or block with them

        //TODO: if no defenders, and unit attack, PB guard on d12 9+
        if (!attack.isPBAttack && !attack.target.anyEffect('defender')) {
            const d12Roll = Dice.d12Roll();
            let guardText = '\nNo guard';
            if (d12Roll >= 9) {
                attack.battles[0].guard = this.player.phoenixborn;
                guardText = ' and WILL guard!';
            }
            const context = this.game.getFrameworkContext(this.player);
            this.game.queueUserAlert(context, {
                style: 'danger',
                promptTitle: 'Chimera guard roll',
                menuTitle: 'Chimera rolled ' + d12Roll + guardText,
            })
        }
    }
}

module.exports = ChimeraDefenceStrategy;