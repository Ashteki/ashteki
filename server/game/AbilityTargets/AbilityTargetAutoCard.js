const _ = require('underscore');

const AbilityTargetCard = require('./AbilityTargetCard.js');

class AbilityTargetAutoCard extends AbilityTargetCard {
    constructor(name, properties, ability) {
        super(name, properties, ability);

        // leftmost (left) or rightmost (right)
        this.aim = properties.aim;
    }

    resolve(context, targetResults) {
        // aim dictates
        const opposingUnits = [...context.player.opponent.battlefield];
        // reverse for L2R
        if (this.aim === 'right') {
            opposingUnits.reverse();
        }

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
