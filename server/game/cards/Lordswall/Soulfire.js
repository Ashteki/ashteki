const { BattlefieldTypes, PhoenixbornTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Soulfire extends Card {
    getTargetData = (ability, remainingPings) => {
        if (remainingPings === 0) {
            return undefined;
        }
        let returnValue = {
            alwaysTriggers: true,
            target: {
                showCancel: true,
                cardCondition: (card, context) => card.type !== CardType.Phoenixborn || card.controller.unitsInPlay.length === 0,
                activePromptTitle: 'Choose a target to deal 1 damage',
                cardType: [...BattlefieldTypes, ...PhoenixbornTypes],
                gameAction: ability.actions.dealDamage({
                    showMessage: true
                })
            }
        };
        returnValue.then = this.getTargetData(ability, remainingPings - 1);

        return returnValue;
    };

    setupCardAbilities(ability) {
        this.play({
            title: 'Soulfire',
            target: {
                activePromptTitle: 'Choose up to 3 cards to remove from the game',
                cardType: CardType.Ally,
                location: 'discard',
                controller: 'self',
                mode: 'upTo',
                numCards: 3,
                gameAction: ability.actions.purge({ showMessage: true })
            },
            then: (context) => ({
                ...this.getTargetData(ability, context.target.length)
            })
        });
    }
}

Soulfire.id = 'soulfire';

module.exports = Soulfire;
