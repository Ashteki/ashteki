const { BattlefieldTypes, UpgradeCardTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShatteringFist extends Card {
    setupCardAbilities(ability) {
        this.play({
            // effect: 'discard card X and deal 3 damage to unit Y',
            target: {
                activePromptTitle: 'Choose an alteration spell to discard',
                cardType: UpgradeCardTypes,
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a unit to deal 3 damage to',
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage({ amount: 3 })
                }
            }
        });
    }
}

ShatteringFist.id = 'shattering-fist';

module.exports = ShatteringFist;
