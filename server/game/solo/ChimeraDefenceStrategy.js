const { CardType } = require("../../constants");
const Dice = require("../dice");

class ChimeraDefenceStrategy {
    constructor(player, game) {
        this.player = player;
        this.game = game;
    }

    execute(attack) {
        //TODO: if defenders are on the battlefield, unit guard or block with them
        const defenders = this.player.unitsInPlay.filter(
            (u) => u !== attack.target && u.anyEffect('defender')
        );
        const battlesToGuard = attack.battles.filter(
            (b) => !b.target.anyEffect('defender') && b.target.type === CardType.Aspect
        );
        defenders.forEach(d => {
            const bat = battlesToGuard.find(b => !b.guard);
            if (!bat) {
                return;
            }
            bat.guard = d;
            if (!attack.isPBAttack) {
                const context = this.game.getFrameworkContext(this.player);
                this.game.queueUserAlert(context, {
                    style: 'danger',
                    promptTitle: 'Aspect Guard',
                    menuTitle: d.name + ' guards for ' + bat.target.name,
                    controls: [
                        {
                            type: 'targeting',
                            source: d.getShortSummary()
                            // ,
                            // targets: [this.attack.target.getShortSummary()]
                        }
                    ]
                });
            }
        });

        //TODO: if no defenders, and unit attack, PB guard on d12 9+
        if (
            !attack.isPBAttack &&
            !attack.target.anyEffect('defender') &&
            !attack.battles[0].guard &&
            attack.target.type === CardType.Aspect
        ) {
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
                menuTitle: 'Chimera rolled ' + d12Roll + guardText
            });
        }

        this.game.writeDefenceMessages(this.player);
    }
}

module.exports = ChimeraDefenceStrategy;