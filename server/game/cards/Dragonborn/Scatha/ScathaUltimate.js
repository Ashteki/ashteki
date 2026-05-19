const UltimateCard = require('../../../solo/UltimateCard');

class ScathaUltimate extends UltimateCard {
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
                return this.doAoEDamage(1, 'Dragonborn Ready Spell');
        }
    }
}

ScathaUltimate.id = 'scatha-ultimate';

module.exports = ScathaUltimate;
