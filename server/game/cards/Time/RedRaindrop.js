const Card = require('../../Card.js');
const { BattlefieldTypes, CardType } = require('../../../constants.js');

class RedRaindrop extends Card {
    setupCardAbilities(ability) {
        this.spellGuard({
            match: this
        });

        this.forcedInterrupt({
            when: {
                onRoundEnded: () => true
            },
            target: {
                activePromptTitle: 'Choose a card to deal 1 damage to',
                optional: true,
                cardType: BattlefieldTypes,
                gameAction: ability.actions.dealDamage()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.source.parent.upgrades.filter((u) => u.id === 'red-raindrop').length ===
                    3,
                gameAction: ability.actions.summon({
                    conjuration: 'reborn-chimera'
                })
            }
        });
    }

    canAttach(card, context) {
        return card && card.getType() === CardType.Phoenixborn && this.canPlayAsUpgrade();
    }
}

RedRaindrop.id = 'red-raindrop';

module.exports = RedRaindrop;
