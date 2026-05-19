const UltimateCard = require('../../../solo/UltimateCard');

class ScathaUltimate extends UltimateCard {
    getUltimateAbility(phase) {
        switch (phase) {
            case 1:
                // lower 1 die
                return this.doLowerOpponentsDice(1);
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
