const DefenceRules = require('../DefenceRules');

class SoloDefenceStrategy {
    constructor(player, game) {
        this.player = player;
        this.game = game;
        this.defenceRules = new DefenceRules();
    }

    execute(attack) {
        // defender aspect blocks
        let remainingDefenders = this.getAvailableDefenders(attack);
        // defenders guard for aspects or the chimera
        const battlesToGuard = this.getBattlesToGuard(attack);
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

        // forced block of unblocked THREATENING attackers if not addressed by 'normal' blockers
        this.handleUnblockedThreateningAttackers(attack, battlesToGuard);

        // PB Guard Rules
        if (
            // a unit attack
            !attack.isPBAttack &&
            this.checkGuardRestrictions(attack) &&
            // doesn't have guard restriction from cardCannot effect (e.g. giftedrose)
            this.player.phoenixborn.checkRestrictions('guard') &&
            // battle has not been pruned (e.g. by card reaction) - (Sentry log error)
            attack.battles[0] &&
            // there is not an existing guard
            !attack.battles[0].guard &&
            // guard is not prevented by the attacker
            !attack.battles[0].attacker.anyEffect('preventGuard', { card: attack.target }) &&
            // or the target cannot be guarded
            !attack.target.anyEffect('cannotBeGuarded')
        ) {
            this.game.queueSimpleStep(() => {
                this.decidePbGuardResponse(attack);
            });
        }

        this.game.queueSimpleStep(() => {
            this.game.writeDefenceMessages(this.player);
        });
    }

    checkGuardRestrictions(attack) {
        return true;
    }

    handleUnblockedThreateningAttackers(attack, battlesToGuard) {
        return;
    }

    decidePbGuardResponse(attack) {
        const decision = {
            willGuard: false,
            textResult: ''
        };

        this.makeGuardDecision(decision);

        this.game.queueSimpleStep(() => {
            let guardText = 'No guard';
            if (decision.willGuard) {
                attack.battles[0].guard = this.player.phoenixborn;
                guardText = 'Opponent WILL guard!' + decision.textResult;
            }
            const context = this.game.getFrameworkContext(this.player);
            const alertProperties = {
                style: 'danger',
                promptTitle: 'Opponent guard roll',
                menuTitle: guardText
            };
            if (decision.die) {
                alertProperties.controls = [
                    {
                        type: 'targeting',
                        source: decision.die.getShortSummary()
                        // targets: [decision.die.getShortSummary()] // [this.attack.target.getShortSummary()]
                    }
                ];
            }
            this.game.queueUserAlert(context, alertProperties);
        });
    }

    allocateBlockers(defenders, battlesToGuard, attack) {
        defenders.forEach((d) => {
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

    makeGuardDecision(decision) {

    }
}

module.exports = SoloDefenceStrategy;
