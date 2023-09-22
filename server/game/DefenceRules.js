class DefenceRules {
    guardTest(card, target, attacker) {
        return (
            !attacker.anyEffect('bypass') &&
            !attacker.anyEffect('preventGuard') &&
            !target.anyEffect('cannotBeGuarded') &&
            card !== target &&
            card.canGuard(attacker)
        );
    }
}

module.exports = DefenceRules;
