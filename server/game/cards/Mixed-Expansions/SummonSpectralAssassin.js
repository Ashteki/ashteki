const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class SummonSpectralAssassin extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Summon Spectral Asssassin',
            target: {
                controller: 'self',
                cardType: CardType.Ally,
                gameAction: ability.actions.returnToHand()
            },
            then: {
                target: {
                    controller: 'self',
                    cardType: CardType.Conjuration,
                    cardCondition: (card) => card.id === 'spectral-assassin',
                    location: 'archives',
                    gameAction: ability.actions.putIntoPlay()
                }
            }
        });
    }
}

SummonSpectralAssassin.id = 'summon-archasaurus-mount';

module.exports = SummonSpectralAssassin;
