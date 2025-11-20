const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class SummonStellarOracle extends Card {
    setupCardAbilities(ability) {
        this.summon('stellar-oracle', {
            title: 'Summon Stellar Oracle',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([
                    new DiceCount(1, Level.Class, Magic.Astral),
                    new DiceCount(1, Level.Basic)
                ])
            ],
            location: 'spellboard'
        });
    }
}

SummonStellarOracle.id = 'summon-stellar-oracle';

module.exports = SummonStellarOracle;
