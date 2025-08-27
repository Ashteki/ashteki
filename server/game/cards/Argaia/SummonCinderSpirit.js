const { Level, Magic, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonCinderSpirit extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place Token',
            cost: [ability.costs.mainAction(), ability.costs.exhaust()],
            gameAction: ability.actions.addStatusToken({ amount: 1 })
        });

        this.action({
            inexhaustible: true,
            title: 'Summon Cinder Spirit',
            cost: [
                ability.costs.sideAction(),
                ability.costs.loseStatus(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Time),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard',
            gameAction: ability.actions.summon({
                conjuration: 'cinder-spirit'
            })
        });
    }
}

SummonCinderSpirit.id = 'summon-cinder-spirit';

module.exports = SummonCinderSpirit;
