const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class RoyalCharm extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            may: 'place a die on Royal Charm',
            when: {
                onDiceSpent: (event, context) =>
                    event.player === context.player &&
                    event.dice.some(
                        (d) =>
                            d.level === Level.Power &&
                            ((d.magic === Magic.Charm &&
                                !context.source.dieUpgrades.some((u) => u.magic === Magic.Charm)) ||
                                (d.magic === Magic.Divine &&
                                    !context.source.dieUpgrades.some(
                                        (u) => u.magic === Magic.Divine
                                    )))
                    )
            },
            title: 'Royal Charm',
            location: 'spellboard',
            gameAction: ability.actions.addStatusToken(() => ({ target: this }))
        });
    }
}

RoyalCharm.id = 'royal-charm';

module.exports = RoyalCharm;
