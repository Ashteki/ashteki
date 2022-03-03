const { CardType } = require('../../constants');

class AttackState {
    constructor(target, attackingPlayer) {
        this.target = target;
        this.target.isDefender = true;
        this.battles = [];
        this.attackingPlayer = attackingPlayer;
        this.defendingPlayer = target.controller;
    }

    get isPBAttack() {
        return this.target.type === CardType.Phoenixborn;
    }

    involvesCard(card) {
        return (
            this.target === card ||
            this.battles.some((b) => b.target === card || b.guard === card || b.attacker === card)
        );
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
                    card.isAttacker = false;
                    b.attacker = null;
                    this.battles = this.battles.filter((bf) => bf !== b);
                    return;
                }
            });
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

    clearAllBlockers() {
        this.battles.forEach((b) => {
            //Can't remove Forced block
            if (b.guard?.anyEffect('forceBlock')) return;
            if (b.guard) b.guard.isDefender = false;
            b.guard = null;
        });
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
}

module.exports = AttackState;
