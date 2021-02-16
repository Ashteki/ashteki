const Card = require('../../Card.js');

class PainShaman extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to a target unit',
            target: {
                optional: true,
                activePromptTitle: 'Choose a unit to damage',
                cardType: ['Ally', 'Conjuration'],
                gameAction: ability.actions.dealDamage({
                    amount: 1
                })
            },
            then: {
                effect: 'remove 1 damage from a unit or phoenixborn',
                target: {
                    optional: true,
                    activePromptTitle: 'Choose a unit to heal',
                    cardType: ['Ally', 'Conjuration', 'Phoenixborn'],
                    gameAction: ability.actions.removeDamage({
                        amount: 1
                    })
                }
            }
        });
    }
}

PainShaman.id = 'pain-shaman';

module.exports = PainShaman;
