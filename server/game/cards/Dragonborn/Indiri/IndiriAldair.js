const DragonbornCard = require('../../../solo/DragonbornCard');

class IndiriAldair extends DragonbornCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            title: 'Loose',
            log: 'each',
            condition: (context) => !context.source.exhausted,
            // place 1 random 'Arrow' conjured aspect onto the battlefield
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.archives.some((c) => c.id.includes('arrow')),
                trueGameAction: ability.actions.summon((context) => ({
                    conjuration: context.player.getRandomArrow(context)
                }))
            })
        });
    }


}

IndiriAldair.id = 'indiri-aldair';

module.exports = IndiriAldair;
