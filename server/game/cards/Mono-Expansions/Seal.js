const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Seal extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Seal',
            target: {
                cardType: [CardType.ReadySpell],
                controller: 'opponent',
                gameAction: ability.actions.exhaust((context) => ({
                    target: context.target.owner.spellboard.filter(
                        (c) => c.name === context.target.name
                    )
                }))
            }
        });
    }
}

Seal.id = 'seal';

module.exports = Seal;
