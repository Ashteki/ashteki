const { PhoenixbornTypes } = require('../../constants');

class AttackState {
    constructor(target, attackingPlayer) {
        this.target = target;
        this.target.isDefender = true;
        this.battles = [];
        this.attackingPlayer = attackingPlayer;
        this.defendingPlayer = target.controller;
    }

    get isPBAttack() {
        return PhoenixbornTypes.includes(this.target.type);
    }

    get attackers() {
        return this.battles.map(b => b.attacker);
    }

    involvesCard(card) {
        return (
            this.target === card ||
            this.battles.some((b) => b.target === card || b.guard === card || b.attacker === card)
        );
    }

    getBattleOpponent(card) {
        const battle = this.battles.find(
            (b) => b.target === card || b.guard === card || b.attacker === card
        );

        if (!battle) {
            return null;
        }

        if (battle.attacker === card) {
            return battle.guard || battle.target;
        } else {
            return battle.attacker;
        }
    }

    removeFromBattle(card, includeResolved = false, damageSource = null) {
        this.battles
            .filter((b) => includeResolved || !b.resolved)
            .forEach((b) => {
                // can remove target during a unit attack
                if (b.target === card) { // unit attack - remove target
                    // reset statuses
                    card.isDefender = false;
                    b.attacker.isAttacker = false;
                    // remove target
                    b.target = null;
                    // exhaust attacker if it was source of the removal (e.g. emberoot lizard)
                    if (damageSource && b.attacker === damageSource) {
                        b.attacker.exhaust();
                    }
                    // prune battle from attack
                    this.battles = this.battles.filter((bf) => bf !== b);
                    return;
                }

                // can remove guards / blockers
                if (b.guard === card) {
                    card.isDefender = false;
                    b.guard = null;
                }

                // can remove attackers (whole battle)
                if (b.attacker === card) {
                    this.removeAttacker(card, b);
                    return;
                }
            });
    }

    removeAttacker(card, battle) {
        // are we given the battle?
        let bat = battle
            ? battle
            : this.battles.filter((b) => !b.resolved).find((b) => b.attacker === card);
        if (!bat) {
            return;
        }

        // remove attacker status
        card.isAttacker = false;
        bat.attacker = null;
        const def = bat.guard;

        // trim battle
        this.battles = this.battles.filter((bf) => bf !== bat);

        return def;
    }

    pruneBattles() {
        // remove battles where attacker is exhausted
        this.battles
            .filter((b) => b.attacker.exhausted && !b.resolved)
            .forEach((b) => {
                b.attacker.isAttacker = false;
                if (b.guard) b.guard.isDefender = false;
                if (b.target && !this.isPBAttack) b.target.isDefender = false;
            });
        this.battles = this.battles.filter((b) => !b.attacker.exhausted && !b.resolved);
    }

    setBlockerForAttacker(blocker, attacker) {
        let fromBattle = this.battles.find(b => b.guard === blocker);
        if (fromBattle) {
            fromBattle.guard = null;
        }

        let battle = this.battles.find((b) => b.attacker === attacker);
        if (battle.guard) {
            battle.guard.isDefender = false;
        }
        battle.guard = blocker;
        blocker.isDefender = true;
        blocker.wasDefender = true;
    }

    clearBlocker(card) {
        const battle = this.battles.find((b) => b.guard === card);
        if (battle) {
            this.clearBattleBlocker(battle);
        }
    }

    clearAllBlockers() {
        this.battles.forEach((b) => {
            this.clearBattleBlocker(b);
        });
    }

    clearBattleBlocker(battle) {
        //Can't remove Forced block
        if (battle.guard?.anyEffect('forceBlock')) return;
        if (battle.guard) {
            battle.guard.isDefender = false;
            battle.guard.wasDefender = false;
        }
        battle.guard = null;
    }

    setGuard(guard) {
        let battle = this.battles[0];
        battle.guard = guard;
        guard.isDefender = true;
        guard.wasDefender = true;
        battle.target.isDefender = false;
    }

    getSummary() {
        let state = {
            target: this.target.uuid,
            isPBAttack: this.isPBAttack,
            attackingPlayer: this.attackingPlayer.id,
            battles: this.battles.map((b) => ({
                key: b.key,
                attacker: b.attacker ? b.attacker.uuid : null,
                target: b.target ? b.target.uuid : null,
                guard: b.guard ? b.guard.uuid : null,
                counter: b.counter ? b.counter.uuid : null
            }))
        };

        return state;
    }

    checkForceBlock() {
        return !this.battles.some(
            (b) => b.guard.anyEffect('forceBlock', b.attacker) && !b.attacker
        );
    }

    checkUnseen() {
        return !this.battles.some((b) => !b.attacker.anyEffect('unseen') && !b.guard);
    }

    getTargetFor(card) {
        const myBattle = this.battles.find(b => b.attacker === card);
        return myBattle.target;
    }
}

module.exports = AttackState;
