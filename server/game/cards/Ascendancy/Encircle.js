const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Encircle extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a unit to deal damage to',
                showCancel: true,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.player.unitsInPlay.filter(
                        (u) => u.type === CardType.Conjuration && !u.exhausted
                    ).length
                }))
            }
        });
    }
}

Encircle.id = 'encircle';

module.exports = Encircle;
