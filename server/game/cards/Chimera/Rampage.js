const { Level } = require('../../../constants');
const AspectCard = require('../../solo/AspectCard');

class Rampage extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            target: {
                toSelect: 'die',
                autoTarget: (context) => context.player.dice.filter((d) => d.level === Level.Basic),
                gameAction: ability.actions.rerollDice()
            },
            effect: 'reroll all basic dice'
        });
    }
}

Rampage.id = 'rampage';

module.exports = Rampage;
