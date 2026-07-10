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

    blockTest(subject, attacker) {
        return (
            !attacker.anyEffect('preventBlock', { card: subject }) &&
            subject.canBlock(attacker) &&
            !subject.anyEffect('forceBlock') // try to not reassign forced blockers
        );
    }
}

module.exports = DefenceRules;
