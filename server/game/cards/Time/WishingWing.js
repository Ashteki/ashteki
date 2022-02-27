const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class WishingWing extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            condition: (context) =>
                context.player.dice.some(
                    (d) => d.magic === Magic.Time && d.level === Level.Power && !d.exhausted
                ),
            gameAction: ability.actions.addStatusToken((context) => ({
                target: context.source
            }))
        });
        this.destroyed({
            inexhaustible: true,
            optional: true,
            activePromptTitle: 'Bequest X',
            gameAction: ability.actions.draw((context) => ({
                amount: context.source.status
            }))
        });
    }
}

WishingWing.id = 'wishing-wing';

module.exports = WishingWing;
