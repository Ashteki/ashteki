const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class BlessingOfLightning extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle:
                    'Choose up to 3 exhausted Divine dice to resolve their dice power',
                toSelect: 'die',
                mode: 'upTo',
                numDice: 3,
                owner: 'self',
                dieCondition: (die) => die.exhausted && die.magic === Magic.Divine,
                gameAction: ability.actions.resolveDieAbility()
            },

        });
    }
}

BlessingOfLightning.id = 'blessing-of-lightning';

module.exports = BlessingOfLightning;
