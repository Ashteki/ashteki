class DefenceRules {
    guardTest(card, target, attacker) {
        return (
            !attacker.anyEffect('preventGuard', { card: card }) &&
            target &&
            !target.anyEffect('cannotBeGuarded') &&
            card !== target &&
            card.canGuard(attacker)
        );
    }

    blockTest(card, attacker) {
        return (
            !attacker.anyEffect('preventBlock', { card: card }) &&
            card.canBlock(attacker) &&
            !card.anyEffect('forceBlock') // try to not reassign forced blockers
        );
    }
}

module.exports = DefenceRules;
