class BaseDieSelector {
    constructor(properties) {
        this.dieCondition = properties.dieCondition;
        this.dieType = properties.dieType;
        this.optional = properties.optional;
        this.owner = properties.owner || 'any';
        this.checkTarget = properties.targets;

        if (!Array.isArray(properties.dieType)) {
            this.dieType = [properties.dieType];
        }
    }

    findPossibleDice(context) {
        if (this.owner === 'self') {
            return context.player.dice;
        } else if (this.owner === 'opponent') {
            return context.player.opponent.dice;
        }

        return context.player.dice;
    }

    canTarget(die, context) {
        if (!die) {
            return false;
        }

        if (this.checkTarget && !die.checkRestrictions('target', context)) {
            return false;
        }

        if (this.owner === 'self' && die.owner !== context.player) {
            return false;
        }

        if (this.owner === 'opponent' && die.owner !== context.player.opponent) {
            return false;
        }

        return (
            //this.dieType.length == 0 ||
            // (
            //     this.dieType.includes(die.getType())
            // &&
            this.dieCondition(die, context)
        );
    }

    getAllLegalTargets(context) {
        return this.findPossibleDice(context).filter((die) => this.canTarget(die, context));
    }

    hasEnoughSelected(selectedDice) {
        return this.optional || selectedDice.length > 0;
    }

    hasEnoughTargets(context) {
        return this.findPossibleDice(context).some((die) => this.canTarget(die, context));
    }

    defaultActivePromptTitle() {
        return 'Choose Dice';
    }

    automaticFireOnSelect() {
        return false;
    }

    // eslint-disable-next-line no-unused-vars
    wouldExceedLimit(selectedDice, die) {
        return false;
    }

    // eslint-disable-next-line no-unused-vars
    hasReachedLimit(selectedDice) {
        return false;
    }

    // eslint-disable-next-line no-unused-vars
    hasExceededLimit(selectedDice) {
        return false;
    }

    formatSelectParam(dice) {
        return dice;
    }
}

module.exports = BaseDieSelector;
