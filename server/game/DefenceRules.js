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
}

module.exports = DefenceRules;
