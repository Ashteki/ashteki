const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Recollect extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a ready spell you control',
                cardType: CardType.ReadySpell,
                location: 'spellboard',
                gameAction: ability.actions.moveCard((context) => ({
                    target: context.player.discard.filter((c) => c.name === context.target.name),
                    destination: 'hand'
                }))
            }
        });
    }
}

Recollect.id = 'recollect';

module.exports = Recollect;
