const { Level } = require('../../constants');
const AbilityDsl = require('../abilitydsl');
const Dice = require('../dice');
const SoloDefenceStrategy = require('./SoloDefenceStrategy');

class BotDefenceStrategy extends SoloDefenceStrategy {
    getBattlesToGuard(attack) {
        return attack.battles.filter((b) => b.target && b.target.owner === attack.defendingPlayer);
    }

    getAvailableDefenders(attack) {
        return this.player.unitsInPlay.filter(
            (u) =>
                u !== attack.target &&
                !attack.getBattleFor(u) &&
                u.availableToBlockOrGuard(attack.target, attack)
        );
    }

    // selector methods
    availableToBlockOrGuard(defender, attack) {
        if (attack.isPBAttack)
            return attack.battles.some((b) => this.defenceRules.blockTest(defender, b.attacker));
        else {
            return attack.battles.some((b) =>
                this.defenceRules.guardTest(defender, b.target, b.attacker)
            );
        }
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

module.exports = BotDefenceStrategy;
