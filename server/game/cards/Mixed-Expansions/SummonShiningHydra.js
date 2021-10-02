const Card = require('../../Card.js');

class SummonShiningHydra extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Summon Shining Hydra',
            gameAction: ability.actions.summon({
                conjuration: 'shining-hydra'
            })
        });
    }
}

SummonShiningHydra.id = 'summon-shining-hydra';

module.exports = SummonShiningHydra;
