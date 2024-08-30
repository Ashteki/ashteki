const { Level } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class Thunderclap extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Rage Burst 4',
            target: {
                toSelect: 'die',
                autoTarget: (context) =>
                    context.player.dice.filter((d) => d.level === Level.Basic).slice(0, 4),
                gameAction: ability.actions.rerollDice()
            }
        });
    }
}

Thunderclap.id = 'thunderclap';

module.exports = Thunderclap;
