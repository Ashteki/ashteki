const { BattlefieldTypes, CardType } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class Riptide extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Riptide',
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.sequentialDamage((context) => ({
                    cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                    numSteps: 2,
                    choosingPlayer: context.target,
                    allowRepeats: true
                }))
            }
        });

        this.retreat();
    }
}

Riptide.id = 'riptide';

module.exports = Riptide;
