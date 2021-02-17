const { BattlefieldTypes, Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShatterPulse extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.controller == context.player && // it's mine
                    BattlefieldTypes.includes(event.card.type) // it's a unit
            },
            target: {
                cardType: BattlefieldTypes,
                gameAction: ability.actions.destroy()
            },
            then: {
                may: "change 2 of opponent's dice",
                target: {
                    toSelect: 'die',
                    dieCondition: (d) => !d.exhausted,
                    mode: 'upTo',
                    numDice: 2,
                    owner: 'opponent',
                    gameAction: ability.actions.setDieLevel({ level: Level.Basic }) //todo: choice
                }
            }
        });
    }
}

ShatterPulse.id = 'shatter-pulse';

module.exports = ShatterPulse;
