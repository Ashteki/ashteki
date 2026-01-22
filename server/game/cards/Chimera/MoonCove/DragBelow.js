const { PhoenixbornTypes } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class DragBelow extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.attachConjuredAlteration({
                    targetType: PhoenixbornTypes,
                    conjuredAlteration: 'drowning'
                })
            }
        });
    }
}

DragBelow.id = 'drag-below';

module.exports = DragBelow;
