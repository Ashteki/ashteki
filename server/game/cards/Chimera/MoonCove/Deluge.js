const { PhoenixbornTypes } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class Deluge extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Deluge',
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: context.player.chimeraPhase,
                    action: ability.actions.attachConjuredAlteration({
                        target: context.target,
                        targetType: PhoenixbornTypes,
                        conjuredAlteration: 'drowning'
                    })
                }))
            }
        });
    }
}

Deluge.id = 'deluge';

module.exports = Deluge;
