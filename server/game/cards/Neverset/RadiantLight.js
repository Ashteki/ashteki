const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class RadiantLight extends Card {
    setupCardAbilities(ability) {
        this.entersSpellboard({
            title: 'Radiant Light',
            target: {
                activePromptTitle: 'Choose an exhausted Divine die to resolve its die power',
                optional: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Divine && die.exhausted,
                gameAction: ability.actions.resolveDieAbility()
            }
        });

        this.persistentEffect({
            condition: () => !this.exhausted,
            match: (card) => card.dieUpgrades.some((die) => die.magic === Magic.Divine),
            effect: [ability.effects.modifyLife(1), ability.effects.modifyRecover(1)]
        });

        this.flicker();
    }
}

RadiantLight.id = 'radiant-light';

module.exports = RadiantLight;
