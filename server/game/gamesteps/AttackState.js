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

    setBlockerForAttacker(blocker, attacker) {
        let battle = this.battles.find((b) => b.attacker === attacker);
        if (battle.guard) {
            battle.guard.isDefender = false;
        }
        battle.guard = blocker;
        blocker.isDefender = true;
    }

    setGuard(blocker) {
        let battle = this.battles[0];
        battle.guard = blocker;
        blocker.isDefender = true;
    }

    getSummary() {
        let state = {
            target: this.target.uuid,
            isPBAttack: this.isPBAttack,
            attackingPlayer: this.attackingPlayer.id,
            battles: this.battles.map((b) => ({
                attacker: b.attacker ? b.attacker.uuid : null,
                target: b.target.uuid,
                guard: b.guard ? b.guard.uuid : null,
                counter: b.counter ? b.counter.uuid : null
            }))
        };

        return state;
    }
}

module.exports = AttackState;
