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
                gameAction: ability.actions.allocateDamage((context) => ({
                    numSteps: 2,
                    cardType: [...BattlefieldTypes, CardType.Phoenixborn],
                    choosingPlayer: context.player.opponent,
                    controller: 'opponent'
                }))
            }
        });

        this.retreat();
    }
}

Riptide.id = 'riptide';

module.exports = Riptide;
