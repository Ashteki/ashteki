const { CardType, Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChannelMagic extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw(),
            then: {
                target: {
                    cardType: CardType.Phoenixborn,
                    gameAction: ability.actions.removeDamage({ amount: 1 })
                },
                then: {
                    target: {
                        toSelect: 'die',
                        mode: 'upTo',
                        numDice: 3,
                        dieCondition: (die) => !die.exhausted && die.level !== Level.Power,
                        owner: 'self',
                        gameAction: ability.actions.raiseDie()
                    }
                }
            }
        });
    }
}

ChannelMagic.id = 'channel-magic';

module.exports = ChannelMagic;
