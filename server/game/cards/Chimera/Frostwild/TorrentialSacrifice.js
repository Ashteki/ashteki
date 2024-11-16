const { CardType } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class TorrentialSacrifice extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Torrential Sacrifice',
            target: {
                mode: 'auto',
                aim: 'right',
                controller: 'self',
                cardType: CardType.ConjuredAspect,
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.conditional({
                    condition: (context) => context.preThenEvent?.context.target,
                    trueGameAction: ability.actions.addRedRainsToken((context) => ({
                        showMessage: true,
                        shortMessage: true,
                        warnMessage: true,
                        target: context.player.phoenixborn
                    })),
                    falseGameAction: ability.actions.summon({
                        conjuration: 'rainwalker'
                    })
                })
            }
        });
    }
}

TorrentialSacrifice.id = 'torrential-sacrifice';

module.exports = TorrentialSacrifice;
