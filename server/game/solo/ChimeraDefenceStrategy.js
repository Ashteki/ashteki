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
        // defender aspect blocks
        let remainingDefenders = this.getAvailableDefenders(attack);
        // defenders guard for aspects or the chimera
        const battlesToGuard = attack.battles.filter(
            (b) => !b.target.anyEffect('defender') &&
                [CardType.Chimera, CardType.Aspect].includes(b.target.type)
        );
        // get threatening battles to block first
        const threateningBattles = battlesToGuard.filter((b) =>
            b.attacker.anyEffect('threatening')
        );
        this.allocateBlockers(remainingDefenders, threateningBattles, attack);

        // block / guard 'normal' attackers
        remainingDefenders = this.getAvailableDefenders(attack);
        this.allocateBlockers(remainingDefenders, battlesToGuard, attack);

        // chimera guards for a unit on 9+
        if (
            // a unit attack
            !attack.isPBAttack &&
            // not targetting a defender
            !attack.target.anyEffect('defender') &&
            // battle has not been pruned (e.g. by card reaction) - (Sentry log error)
            attack.battles[0] &&
            // there is not an existing guard
            !attack.battles[0].guard &&
            // guard is not prevented by the attacker
            !attack.battles[0].attacker.anyEffect('preventGuard') &&
            // or the target cannot be guarded
            !attack.target.anyEffect('cannotBeGuarded') &&
            // and the target is an aspect (chimera won't guard tourists like blood puppet)
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

        // forced block of unblocked THREATENING attackers
        if (
            attack.isPBAttack &&
            attack.battles.some((b) => b.attacker.anyEffect('threatening') && !b.guard)
        ) {
            const nonDefenders = this.player.unitsInPlay.filter(
                (u) => u !== attack.target && !u.anyEffect('defender') && !u.isDefender
            );

            // try and assign to battles
            nonDefenders.forEach(d => {
                const bat = battlesToGuard.find(
                    (b) => !b.guard && b.attacker.anyEffect('threatening')
                );
                if (!bat) {
                    return;
                }
                attack.setGuard(d, bat);
            });

            this.game.writeDefenceMessages(this.player);
        }
    }

    getAvailableDefenders(attack) {
        return this.player.unitsInPlay.filter(
            (u) => u !== attack.target && u.anyEffect('defender') && !attack.getBattleFor(u)
        );
    }

    allocateBlockers(defenders, battlesToGuard, attack) {
        defenders.forEach(d => {
            const bat = battlesToGuard.find(
                (b) => !b.guard && this.defenceRules.guardTest(d, b.target, b.attacker)
            );
            if (!bat) {
                return;
            }
            attack.setGuard(d, bat);

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
                        }
                    ]
                });
            }
        });
    }
}

module.exports = ChimeraDefenceStrategy;
