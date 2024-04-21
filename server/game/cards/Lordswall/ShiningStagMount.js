const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShiningStagMount extends Card {
    setupCardAbilities(ability) {
        this.dismount();

        this.entersPlay({
            title: 'Armed',
            target: {
                activePromptTitle: 'Choose an exhausted Divine die to resolve its die power',
                optional: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Divine && die.exhausted,
                gameAction: ability.actions.resolveDieAbility()
            }
        })
    }
}

ShiningStagMount.id = 'shining-stag-mount';

module.exports = ShiningStagMount;
