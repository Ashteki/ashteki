const { CardType } = require('../../constants');

class AttackState {
    constructor(target, attackingPlayer) {
        this.target = target;
        this.battles = [];
        this.attackingPlayer = attackingPlayer;
        this.defendingPlayer = target.controller;
    }

    get isPBAttack() {
        return this.target.type === CardType.Phoenixborn;
    }

    setBlockerForAttacker(blocker, attacker) {
        let battle = this.battles.find((b) => b.attacker === attacker);
        battle.guard = blocker;
        blocker.isDefender = true;
    }

    getSummary() {
        let state = {
            target: this.target.id,
            attackingPlayer: this.attackingPlayer.uuid,
            battles: this.battles.map((b) => ({
                attacker: b.attacker ? b.attacker.uuid : null,
                target: b.target,
                guard: b.guard ? b.guard.uuid : null,
                counter: b.counter ? b.counter.uuid : null
            }))
        };

        return state;
    }
}

module.exports = AttackState;
