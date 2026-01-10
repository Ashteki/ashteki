const Card = require('../../Card.js');

class SparkDrone extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();
    }
}

SparkDrone.id = 'spark-drone';

module.exports = SparkDrone;