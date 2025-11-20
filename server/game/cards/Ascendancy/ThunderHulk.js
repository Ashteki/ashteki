const Card = require('../../Card.js');

class ThunderHulk extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.isCharged,
            effect: ability.effects.cardCannot('attack')
        });

        this.persistentEffect({
            effect: ability.effects.addKeyword({ overkill: 1 })
        });
    }
}

ThunderHulk.id = 'thunder-hulk';

module.exports = ThunderHulk;
