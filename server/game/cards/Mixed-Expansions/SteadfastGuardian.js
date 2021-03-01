const Card = require('../../Card.js');

class SteadfastGuardian extends Card {
    setupCardAbilities() {
        this.unitGuard();

        this.alert();
    }
}

SteadfastGuardian.id = 'steadfast-guardian';

module.exports = SteadfastGuardian;
