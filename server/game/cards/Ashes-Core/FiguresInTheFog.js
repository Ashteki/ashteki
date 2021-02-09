const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class FiguresInTheFog extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    // opponent declares attackers
                    return event.attackingPlayer === context.source.owner.opponent;
                }
            },
            target: {
                optional: true,
                cardCondition: (card) => card.isAttacker,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: [ability.actions.exhaust(), ability.actions.removeFromBattle()]
            }
        });
    }
}

FiguresInTheFog.id = 'figures-in-the-fog';

module.exports = FiguresInTheFog;
