const { Level, Magic, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonGhostlyMount extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Ghostly Mount',
            cost: [
                ability.costs.chosenAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Illusion),
                    new DiceCount(1, Level.Class, Magic.Sympathy)
                ])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: CardType.Ally,
                cardCondition: (card) => !card.exhausted,
                gameAction: ability.actions.purge()
            },
            then: {
                target: {
                    controller: 'self',
                    cardType: 'Conjuration',
                    cardCondition: (card) =>
                        card.id === 'pale-steed-mount' ||
                        card.id === 'spectral-charger-mount' ||
                        (this.focus > 1 && card.id === 'nightmare-mount'),
                    location: 'archives',
                    gameAction: [
                        ability.actions.putIntoPlay(),
                        ability.actions.placeUnder((context) => ({
                            parent: context.target,
                            target: context.preThenEvent.card,
                            facedown: true
                        }))
                    ]
                }
            }
        });
    }
}

SummonGhostlyMount.id = 'summon-ghostly-mount';

module.exports = SummonGhostlyMount;
