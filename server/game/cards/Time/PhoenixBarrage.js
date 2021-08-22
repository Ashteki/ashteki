const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class PhoenixBarrage extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a unit to damage',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage({
                    amount: 2
                })
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a second unit to damage',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({
                        amount: 2
                    })
                },
                then: {
                    target: {
                        activePromptTitle: 'Choose a phoenixborn to damage',
                        cardType: CardType.Phoenixborn,
                        gameAction: ability.actions.dealDamage({
                            amount: 2
                        })
                    }
                }
            }
        });
    }
}

PhoenixBarrage.id = 'phoenix-barrage';

module.exports = PhoenixBarrage;
