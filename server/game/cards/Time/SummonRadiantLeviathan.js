const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class SummonRadiantLeviathan extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Summon Radiant Leviathan',
            gameAction: ability.actions.summon({
                conjuration: 'radiant-leviathan'
            }),
            then: {
                gameAction: ability.actions.addStatusToken((context) => ({
                    target: context.preThenEvent.cards,
                    amount: context.player.unitsInPlay.filter(
                        (c) =>
                            c.type === CardType.Conjuration &&
                            !context.preThenEvent.cards.includes(c)
                    ).length
                }))
            }
        });
    }
}

SummonRadiantLeviathan.id = 'summon-radiant-leviathan';

module.exports = SummonRadiantLeviathan;
