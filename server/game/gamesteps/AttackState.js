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

    removeFromBattle(card) {
        this.battles.forEach((b) => {
            // can remove unit target
            if (b.target === card) {
                card.isDefender = false;
                b.target = null;
            }

            // can remove guards / blockers
            if (b.guard === card) {
                card.isDefender = false;
                b.guard = null;
            }

            // can remove attackers (whole battle)
            if (b.attacker === card) {
                card.isAttacker = false;
                this.battles = this.battles.filter((bf) => bf !== b);
                return;
            }
        });
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
        battle.target.isDefender = false;
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

    checkUnseen() {
        return !this.battles.some((b) => !b.attacker.anyEffect('unseen') && !b.guard);
    }
}

module.exports = AttackState;
