const { CardType, AspectTypes, Level } = require('../../constants');
const AbilityDsl = require('../abilitydsl');
const Dice = require('../dice');
const SoloDefenceStrategy = require('./SoloDefenceStrategy');

class ChimeraDefenceStrategy extends SoloDefenceStrategy {
    handleUnblockedThreateningAttackers(attack, battlesToGuard) {
        if (
            attack.isPBAttack &&
            attack.battles.some((b) => b.attacker.anyEffect('threatening') && !b.guard)) {
            this.game.queueSimpleStep(() => {
                this.handleThreateningAttackers(attack, battlesToGuard);
            });
        }
    }

    checkGuardRestrictions(attack) {
        // not targetting a defender
        return (
            !attack.target.anyEffect('defender') &&
            // and the target is an aspect (chimera won't guard tourists like blood puppet)
            AspectTypes.includes(attack.target.type)
        );
    }

    getBattlesToGuard(attack) {
        return attack.battles.filter(
            (b) => b.target &&
                !b.target.anyEffect('defender') &&
                [CardType.Chimera, CardType.Dragonborn, ...AspectTypes].includes(b.target.type)
        );
    }

    handleThreateningAttackers(attack, battlesToGuard) {
        const nonDefenders = this.player.unitsInPlay.filter(
            (u) => u !== attack.target && !u.anyEffect('defender') && !u.isDefender && !u.exhausted
        );

        // try and assign to battles
        nonDefenders.forEach((d) => {
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

    makeGuardDecision(decision) {
        if (this.player.isDragonborn) {
            const basicDie = this.player.dice.find((die) => die.level === Level.Basic);
            const rollResult = AbilityDsl.actions
                .rerollDice({ target: basicDie })
                .resolve(basicDie, this.game.getFrameworkContext(this.player));

            this.game.queueSimpleStep(() => {
                const rolledDie = rollResult.event.childEvent.diceCopyAfterRoll[0];
                decision.willGuard = rolledDie.level === Level.Basic;
                decision.die = rolledDie;
            });
        } else {
            const d12Roll = Dice.d12Roll();

            decision.willGuard = d12Roll >= 9;
            decision.textResult = ` (${d12Roll})`;
        }
    }
}

module.exports = ChimeraDefenceStrategy;
