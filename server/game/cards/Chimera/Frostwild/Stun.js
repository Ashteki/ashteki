const { PhoenixbornTypes, Level } = require('../../../../constants.js');
const Card = require('../../../Card.js');
const AbilityDsl = require('../../../abilitydsl.js');

class Stun extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.exhausted()]
        });

        this.action({
            title: 'Unstun',
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
        return (
            !card.upgrades.some((u) => u.id === 'stun') &&
            ((card && PhoenixbornTypes.includes(card.getType()) && this.canPlayAsUpgrade()) ||
                super.canAttach(card, context))
        );
    }
}

Stun.id = 'stun';

module.exports = Stun;
