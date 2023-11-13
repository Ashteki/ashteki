const AspectCard = require('../../../solo/AspectCard');

class GiantsMight extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: "Giant's Might 1",
            gameAction: ability.actions.attachConjuredAlteration((context) => ({
                conjuredAlteration: 'vigor',
                target: context.source
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.chimeraPhase > 1,
                gameAction: ability.actions.attachConjuredAlteration((context) => ({
                    conjuredAlteration: 'vigor',
                    target: context.source
                })),
                then: {
                    alwaysTriggers: true,
                    condition: (context) => context.player.chimeraPhase > 2,
                    gameAction: ability.actions.attachConjuredAlteration((context) => ({
                        conjuredAlteration: 'vigor',
                        target: context.source
                    }))
                }
            }
        });

        this.persistentEffect({
            effect: ability.effects.addKeyword({ gigantic: 2 })
        });
    }
}

GiantsMight.id = 'giants-might';

module.exports = GiantsMight;
