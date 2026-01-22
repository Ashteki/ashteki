const { Level, PhoenixbornTypes } = require('../../../../constants.js');
const Card = require('../../../Card.js');
const AbilityDsl = require('../../../abilitydsl.js');

class Drowning extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword({ drowning: 1 })
        });

        this.action({
            title: 'Gasp for air',
            cost: ability.costs.sideAction(),
            target: {
                showCancel: true,
                activePromptTitle: 'Choose a die to lower one level',
                toSelect: 'die',
                mode: 'exactly',
                numDice: 1,
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                gameAction: AbilityDsl.actions.lowerDie()
            },
            then: {
                gameAction: ability.actions.discard({ target: this }),
                message: '{1} is discarded'
            }
        });
    }

    canAttach(card, context) {
        return card && PhoenixbornTypes.includes(card.getType()) && this.canPlayAsUpgrade();
    }
}

Drowning.id = 'drowning';

module.exports = Drowning;
