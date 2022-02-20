const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class RaywardRecruit extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Armed',
            target: {
                toSelect: 'die',
                owner: 'self',
                condition: (die) => die.type === Magic.Divine && die.exhausted,
                gameAction: ability.actions.resolveDieAbility()
            }
        });
    }
}

RaywardRecruit.id = 'rayward-recruit';

module.exports = RaywardRecruit;
