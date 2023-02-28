const _ = require('underscore');

const AbilityTargetCard = require('./AbilityTargetCard.js');

class AbilityTargetAutoCard extends AbilityTargetCard {
    constructor(name, properties, ability) {
        super(name, properties, ability);

        // leftmost (L2R) or rightmost (R2L)
        this.aim = properties.aim;
    }

    resolve(context, targetResults) {
        // aim dictates
        const opposingUnits = [...context.player.opponent.unitsInPlay];
        // reverse for L2R

        // loop
        for (const unit of opposingUnits) {
            if (this.selector.canTarget(unit, context)) {
                this.setSelectedCard(context, unit);

                return true;
            }
        }

        return false;
    }
}

module.exports = AbilityTargetAutoCard;
