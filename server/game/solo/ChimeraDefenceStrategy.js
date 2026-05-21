const { CardType, AspectTypes, Level } = require("../../constants");
const AbilityDsl = require('../abilitydsl');
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
            (b) => b.target && !b.target.anyEffect('defender') &&
                [CardType.Chimera, ...AspectTypes].includes(b.target.type)
        );

        if (battlesToGuard.length === 0) {
            return;
        }

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
            // doesn't have guard restriction from cardCannot effect (e.g. giftedrose)
            this.player.phoenixborn.checkRestrictions('guard') &&
            // battle has not been pruned (e.g. by card reaction) - (Sentry log error)
            attack.battles[0] &&
            // there is not an existing guard
            !attack.battles[0].guard &&
            // guard is not prevented by the attacker
            !attack.battles[0].attacker.anyEffect('preventGuard', { card: attack.target }) &&
            // or the target cannot be guarded
            !attack.target.anyEffect('cannotBeGuarded') &&
            // and the target is an aspect (chimera won't guard tourists like blood puppet)
            AspectTypes.includes(attack.target.type)
        ) {
            this.game.queueSimpleStep(() => {
                this.doPvEGuardRoll(attack);
            });
        }

        // forced block of unblocked THREATENING attackers
        if (
            attack.isPBAttack &&
            attack.battles.some((b) => b.attacker.anyEffect('threatening') && !b.guard)
        ) {
            this.game.queueSimpleStep(() => {
                this.handleThreateningAttackers(attack, battlesToGuard);
            });
        }

        this.game.queueSimpleStep(() => {
            this.game.writeDefenceMessages(this.player);
        });
    }

    doPvEGuardRoll(attack) {
        const decision = {
            willGuard: false,
            textResult: ''
        };

        if (this.player.isDragonborn) {
            const basicDie = this.player.dice.find((die) => die.level === Level.Basic);
            const rollResult = AbilityDsl.actions
                .rerollDice({ target: basicDie })
                .resolve(basicDie, this.game.getFrameworkContext(this.player));

            this.game.queueSimpleStep(() => {
                const rolledRageDie = rollResult.event.childEvent.diceCopyAfterRoll[0];
                decision.willGuard = rolledRageDie.level === Level.Basic;
                decision.textResult = rolledRageDie;
            });
        } else {
            const d12Roll = Dice.d12Roll();

            decision.willGuard = d12Roll >= 9;
            decision.textResult = d12Roll;
        }

        this.game.queueSimpleStep(() => {
            let guardText = '\nNo guard';
            if (decision.willGuard) {
                attack.battles[0].guard = this.player.phoenixborn;
                guardText = ' and WILL guard!';
            }
            const context = this.game.getFrameworkContext(this.player);
            this.game.queueUserAlert(context, {
                style: 'danger',
                promptTitle: 'Chimera guard roll',
                menuTitle: 'Chimera rolled ' + decision.textResult + guardText
            });
        });
    }

    handleThreateningAttackers(attack, battlesToGuard) {
        const nonDefenders = this.player.unitsInPlay.filter(
            (u) => u !== attack.target && !u.anyEffect('defender') && !u.isDefender && !u.exhausted
        );

        // try and assign to battles
        nonDefenders.forEach(d => {
            const bat = battlesToGuard.find((b) => !b.guard && b.attacker.anyEffect('threatening'));
            if (!bat) {
                return;
            }
            attack.setGuard(d, bat);
        });
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
