const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonMaskedWolf extends Card {
    setupCardAbilities(ability) {
        this.preventAutoDice = true;

        this.action({
            title: 'Summon Masked Wolf',
            cost: [
                ability.costs.sideAction(),
                ability.costs.exhaust(),
                ability.costs.dice([new DiceCount(1, Level.Class, Magic.Illusion)])
            ],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'masked-wolf',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay({
                    postHandler: (context) => {
                        if (
                            context.source.focus > 0 &&
                            context.costs.returnDice.some((d) => d.level === 'power')
                        ) {
                            context.player.actions.side += 1;
                        }
                    }
                })
            }
        });
    }
}

SummonMaskedWolf.id = 'summon-masked-wolf';

module.exports = SummonMaskedWolf;
