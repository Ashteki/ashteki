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
        this.from = properties.from;
    }

    findPossibleDice(context) {
        if (typeof this.from === 'function') {
            return this.from(context);
        }

        if (this.owner === 'self') {
            return context.player.getSpendableDice();
        } else if (this.owner === 'opponent') {
            return context.player.opponent.getSpendableDice();
        }

        return context.player.getSpendableDice().concat(context.player.opponent.getSpendableDice());
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

        if (
            die.owner === context.player.opponent &&
            context.ability &&
            context.ability.properties &&
            context.ability.properties.changeDie &&
            !context.player.checkRestrictions('changeOpponentsDice')
        ) {
            return false;
        }

        return this.dieCondition(die, context);
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
