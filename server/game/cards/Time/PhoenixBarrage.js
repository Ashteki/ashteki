const { BattlefieldTypes, CardType, PhoenixbornTypes } = require('../../../constants.js');
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
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose a second unit to damage',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.dealDamage({
                        amount: 2,
                        showMessage: true
                    })
                },
                then: {
                    alwaysTriggers: true,
                    target: {
                        activePromptTitle: 'Choose a phoenixborn to damage',
                        cardType: PhoenixbornTypes,
                        gameAction: ability.actions.dealDamage({
                            amount: 2,
                            showMessage: true
                        })
                    }
                }
            }
        });
    }
}

PhoenixBarrage.id = 'phoenix-barrage';

module.exports = PhoenixBarrage;
