const Card = require('../../Card.js');

class WeepingSpirit extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cardCannot('block')
        });

        // side action
        this.action({
            title: 'Quell',
            cost: [ability.costs.sideAction(), ability.costs.discard()],
            gameAction: ability.actions.destroy({ target: this })
        });
    }
}

WeepingSpirit.id = 'weeping-spirit';

module.exports = WeepingSpirit;
