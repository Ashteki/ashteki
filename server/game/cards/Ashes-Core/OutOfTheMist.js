const Card = require('../../Card.js');
const { BattlefieldTypes } = require('../../../constants');

class OutOfTheMist extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a target',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.player.unitsInPlay.length
                }))
            },
            then: {
                alwaysTriggers: true,
                may: 'draw a card',
                gameAction: ability.actions.draw()
            }
        });
    }
}

OutOfTheMist.id = 'out-of-the-mist';

module.exports = OutOfTheMist;
