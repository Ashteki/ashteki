const Card = require('../../Card.js');

class SeekTheDepths extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Seek the Depths',
            gameAction: ability.actions.summon({
                conjuration: 'soul-delver'
            })
            ,
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.addStatusToken((context) => ({
                    target: context.player.phoenixborn
                })),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.returnToDeck((context) => ({
                        target: context.source
                    }))
                }
            }
        });
    }
}

SeekTheDepths.id = 'seek-the-depths';

module.exports = SeekTheDepths;
