const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class SummonGilder extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Gilder',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([{ magic: 'natural', level: 'class' }])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'gilder',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            },
            then: {
                gameAction: ability.actions.dealDamage((context) => ({
                    promptForSelect: {
                        optional: true,
                        cardCondition: (card) => card !== context.preThenEvent.card,
                        activePromptTitle: 'Deal 1 damage',
                        cardType: [...BattlefieldTypes]
                    }
                }))
            }
        });
    }
}

SummonGilder.id = 'summon-gilder';

module.exports = SummonGilder;
