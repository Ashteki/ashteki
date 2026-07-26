const UltimateCard = require('../../../solo/UltimateCard');

class IndiriUltimate extends UltimateCard {
    getUltimateAbility(phase) {
        switch (phase) {
            case 1:
                // lower 1 die
                return this.lowerOpponentsDice(1);
            case 2:
                // deal 1 damage to rightmost unit or pb
                return this.pbOrRightmostDamage();
            case 3:
                // mill or damage
                return this.millOrDamage();
        }
    }

    getProgressAbility(phase) {
        switch (phase) {
            case 1:
                return this.aoEDamage(1, 'Dragonborn Ready Spell');
            case 2:
                return this.damageLeftmost(3);
            case 3:
                return this.damageLeftmost(3, true);
        }
    }
}

IndiriUltimate.id = 'indiri-ultimate';

module.exports = IndiriUltimate;
