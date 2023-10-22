const AspectCard = require('../../../solo/AspectCard');

class StormBolt extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Storm Bolt 1',
            target: {
                mode: 'auto',
                cardCondition: (card) => !card.exhausted,
                aim: 'right',
                gameAction: ability.actions.attachConjuredAlteration({
                    conjuredAlteration: 'stun'
                })
            },
            then: (thenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.conditional({
                    condition: () => !thenContext.target,
                    trueGameAction: ability.actions.dealDamage({
                        target: thenContext.player.opponent.phoenixborn
                    })
                })
            })
        });
    }
}

StormBolt.id = 'storm-bolt';

module.exports = StormBolt;
