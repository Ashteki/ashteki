const { BattlefieldTypes, PhoenixbornTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Soulfire extends Card {
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
                ...this.getTargettedAbilityChain(ability, context.target.length, {
                    cardCondition: (card, context) =>
                        card.type !== CardType.Phoenixborn ||
                        card.controller.unitsInPlay.length === 0,
                    cardType: [...BattlefieldTypes, ...PhoenixbornTypes]
                })
            })
        });
    }
}

Soulfire.id = 'soulfire';

module.exports = Soulfire;
