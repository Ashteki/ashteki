const { BattlefieldTypes, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class SilverPaladin extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Smite 1',
            effect: 'destroy {0}',
            target: {
                activePromptTitle: 'Choose a unit to destroy',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                cardCondition: (card) => card.attack <= 1,
                gameAction: ability.actions.destroy()
            }
        });

        this.afterDestroysInMyTurn({
            autoResolve: true,
            target: {
                activePromptTitle: 'Choose an exhausted Divine die to resolve its die power',
                optional: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Divine && die.exhausted,
                gameAction: ability.actions.resolveDieAbility()
            }
        });
    }
}

SilverPaladin.id = 'silver-paladin';

module.exports = SilverPaladin;
