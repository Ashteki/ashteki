const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class RaywardRecruit extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Armed',
            target: {
                activePromptTitle: 'Choose an exhausted Divine die to resolve its die power',
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Divine && die.exhausted,
                gameAction: ability.actions.resolveDieAbility()
            }
        });
    }
}

RaywardRecruit.id = 'rayward-recruit';

module.exports = RaywardRecruit;
