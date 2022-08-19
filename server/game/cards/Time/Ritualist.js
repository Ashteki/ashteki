const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Ritualist extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            title: 'Armed',
            target: {
                activePromptTitle: 'Choose a Chant card to place in your hand',
                optional: true,
                cardType: CardType.ReadySpell,
                cardCondition: (card) => card.name.includes('Chant'),
                location: ['discard', 'deck'],
                gameAction: ability.actions.moveCard({
                    destination: 'hand',
                    shuffle: true
                })
            }
        });
    }
}

Ritualist.id = 'ritualist';

module.exports = Ritualist;
