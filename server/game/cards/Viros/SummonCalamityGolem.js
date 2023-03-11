const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class SummonCalamityGolem extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Summon Calamity Golem',
            target: {
                controller: 'self',
                cardType: CardType.Ally,
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.summon({
                    conjuration: 'calamity-golem'
                }),
                then: {
                    gameAction: ability.actions.addDamageToken((context) => ({
                        target: context.preThenEvent.context.summoned,
                        amount: context.preThenEvent.context.preThenEvent.card.recover
                    }))
                }
            }
        });
    }
}

SummonCalamityGolem.id = 'summon-calamity-golem';

module.exports = SummonCalamityGolem;
