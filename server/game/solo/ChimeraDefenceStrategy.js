const { CardType } = require("../../constants");
const DefenceRules = require("../DefenceRules");
const Dice = require("../dice");

class ChimeraDefenceStrategy {
    constructor(player, game) {
        this.player = player;
        this.game = game;
        this.defenceRules = new DefenceRules();
    }

    execute(attack) {
        //TODO: if defenders are on the battlefield, unit guard or block with them
        const defenders = this.player.unitsInPlay.filter(
            (u) => u !== attack.target && u.anyEffect('defender')
        );
        const battlesToGuard = attack.battles.filter(
            (b) => !b.target.anyEffect('defender') && b.target.type === CardType.Aspect
        );

        // defenders guard for aspects
        defenders.forEach(d => {
            const bat = battlesToGuard.find(
                (b) => !b.guard && this.defenceRules.guardTest(d, b.target, b.attacker)
            );
            if (!bat) {
                return;
            }
            bat.guard = d;

            // alert if this is a unit attack
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

        // chimera guards for a unit on 9+
        if (
            !attack.isPBAttack &&
            !attack.target.anyEffect('defender') &&
            !attack.battles[0].guard &&
            !attack.battles[0].attacker.anyEffect('preventGuard') &&
            !attack.target.anyEffect('cannotBeGuarded') &&
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
