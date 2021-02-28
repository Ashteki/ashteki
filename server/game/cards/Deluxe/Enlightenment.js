const Card = require('../../Card.js');

class Enlightenment extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Enlightenment',
            target: {
                gameAction: ability.actions.removeExhaustion({ amount: 1 })
            }
        });
    }
}

Enlightenment.id = 'enlightenment';

module.exports = Enlightenment;
