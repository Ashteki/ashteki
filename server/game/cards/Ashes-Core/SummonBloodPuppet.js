const Card = require('../../Card.js');

class SummonBloodPuppet extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Summon Blood Puppet',
            cost: [
                ability.costs.mainAction(),
                ability.costs.exhaust(),
                ability.costs.dice([{ magic: 'ceremonial', level: 'class' }])
            ],
            location: 'spellboard',
            target: {
                player: 'self',
                cardType: 'Conjuration',
                cardCondition: (card) => card.id === 'blood-puppet',
                location: 'archives',
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

SummonBloodPuppet.id = 'summon-blood-puppet';

module.exports = SummonBloodPuppet;
