const { Level, PhoenixbornTypes } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class Undertow extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Undertow',
            target: {
                autoTarget: (context) => context.player.opponent.phoenixborn,
                gameAction: ability.actions.attachConjuredAlteration({
                    targetType: PhoenixbornTypes,
                    conjuredAlteration: 'drowning'
                })
            },
            then: {
                alwaysTriggers: true,
                target: {
                    toSelect: 'die',
                    autoTarget: (context) => {
                        const drowningLevel =
                            context.player.opponent.phoenixborn.getKeywordValue('drowning');
                        return context.player.dice
                            .filter((d) => d.level === Level.Basic)
                            .slice(0, drowningLevel);
                    },
                    gameAction: ability.actions.rerollDice()
                }
            }
        });

        this.retreat();
    }
}

Undertow.id = 'undertow';

module.exports = Undertow;
