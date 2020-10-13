const Card = require('../../Card.js');

class OutOfTheMist extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal X damage to a target unit',
            target: {
                activePromptTitle: 'Choose a target',
                cardType: ['Ally', 'Conjuration'],
                controller: 'opponent',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.player.cardsInPlay.length
                }))
            }
        });
    }
}

OutOfTheMist.id = 'out-of-the-mist';

module.exports = OutOfTheMist;
