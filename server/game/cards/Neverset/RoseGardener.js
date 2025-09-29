const Card = require('../../Card.js');
const { BattlefieldTypes, CardType, Magic, UpgradeCardTypes } = require('../../../constants.js');

class RoseGardener extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            effect: 'remove 1 status from {1}',
            effectArgs: (context) => context.target,
            target: {
                optional: true,
                activePromptTitle: 'Choose a unit or spell to remove 1 status from',
                cardType: [...BattlefieldTypes, CardType.ReadySpell, ...UpgradeCardTypes],
                gameAction: ability.actions.removeStatus()
            }
        });

        this.action({
            title: 'Cultivate',
            cost: [ability.costs.sideAction()],
            gameAction: ability.actions.changeDice({
                dieCondition: (die) => !die.exhausted && die.magic === Magic.Charm,
                owner: 'self'
            })
        });
    }
}

RoseGardener.id = 'rose-gardener';

module.exports = RoseGardener;
