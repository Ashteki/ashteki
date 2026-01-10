const { CardType, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class CoreSupplier extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Supply 2',
            target: {
                activePromptTitle: 'Choose an exhausted Artifice die to resolve',
                optional: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Artifice && die.exhausted,
                gameAction: ability.actions.resolveDieAbility()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose an exhausted Artifice die to resolve',
                    optional: true,
                    toSelect: 'die',
                    owner: 'self',
                    dieCondition: (die) => die.magic === Magic.Artifice && die.exhausted,
                    gameAction: ability.actions.resolveDieAbility()
                }
            }
        });
    }
}

CoreSupplier.id = 'core-supplier';

module.exports = CoreSupplier;
