const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class SummonSpectralAssassin extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Summon Spectral Assassin',
            target: {
                controller: 'self',
                cardType: CardType.Ally,
                gameAction: ability.actions.returnToHand()
            },
            then: {
                gameAction: ability.actions.summon({
                    conjuration: 'spectral-assassin'
                }),
                then: {
                    alwaysTriggers: true,
                    may: 'draw a card',
                    gameAction: ability.actions.draw({ showMessage: true })
                }
            }
        });
    }
}

SummonSpectralAssassin.id = 'summon-spectral-assassin';

module.exports = SummonSpectralAssassin;
