const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class TidalCrab extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            unblankable: true,
            effect: [ability.effects.modifyAttack(() => 0 - this.status)]
        });

        this.action({
            title: 'Unburden',
            cost: [ability.costs.sideAction()],
            target: {
                activePromptTitle: 'Choose a unit to move a status token to',
                cardType: BattlefieldTypes,
                controller: 'self',
                gameAction: ability.actions.moveToken((context) => ({
                    from: context.source,
                    to: context.target,
                    type: 'status'
                }))
            }
        });
    }
}

TidalCrab.id = 'tidal-crab';

module.exports = TidalCrab;
