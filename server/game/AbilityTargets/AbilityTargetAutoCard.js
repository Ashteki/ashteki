const AbilityTargetCard = require('./AbilityTargetCard.js');

class AbilityTargetAutoCard extends AbilityTargetCard {
    constructor(name, properties, ability) {
        super(name, properties, ability);

        // leftmost (left) or rightmost (right)
        this.aim = properties.aim;
        this.controller = properties.controller || 'opponent';
    }

    resolve(context, targetResults) {
        // aim dictates
        const possibleUnits =
            this.controller === 'self'
                ? [...context.player.unitsInPlay]
                : [...context.player.opponent.unitsInPlay];

        // reverse for L2R
        if (this.aim === 'right') {
            possibleUnits.reverse();
        }

        // loop
        for (const unit of possibleUnits) {
            if (this.selector.canTarget(unit, context)) {
                this.setSelectedCard(context, unit);

                return true;
            }
        }

        return false;
    }
}

module.exports = AbilityTargetAutoCard;
