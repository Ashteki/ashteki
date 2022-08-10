const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class TsunamiShot extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                activePromptTitle: 'Choose a unit to damage',
                cardType: BattlefieldTypes,
                controller: 'opponent',
                gameAction: ability.actions.dealDamage()
            },
            then: {
                target: {
                    optional: true,
                    activePromptTitle: 'Choose a unit to damage',
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage()
                },
                then: {
                    target: {
                        optional: true,
                        activePromptTitle: 'Choose a unit to damage',
                        cardType: BattlefieldTypes,
                        controller: 'opponent',
                        gameAction: ability.actions.dealDamage()
                    },
                    then: {
                        target: {
                            optional: true,
                            activePromptTitle: 'Choose a unit to damage',
                            cardType: BattlefieldTypes,
                            controller: 'opponent',
                            gameAction: ability.actions.dealDamage()
                        }
                    }
                }
            }
        });
    }
}

TsunamiShot.id = 'tsunami-shot';

module.exports = TsunamiShot;
