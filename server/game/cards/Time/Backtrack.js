const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Backtrack extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Backtrack',
            effect: "return {0} to owner's hand",
            when: {
                // opponent declares attackers
                onAttackersDeclared: (event, context) =>
                    event.attackingPlayer === context.source.owner.opponent
            },
            target: {
                activePromptTitle: 'Choose an attacker to return to hand',
                cardType: BattlefieldTypes,
                cardCondition: (card) => card.isAttacker && card.type === CardType.Ally,
                controller: 'opponent',
                gameAction: [ability.actions.removeFromBattle(), ability.actions.returnToHand()]
            }
        });
    }
}

Backtrack.id = 'backtrack';

module.exports = Backtrack;
