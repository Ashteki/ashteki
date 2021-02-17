const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class BlackcloudNinja extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Seal Strike 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            gameAction: ability.actions.chosenExhaust((context) => ({
                target: context.player.opponent,
                cardType: CardType.ReadySpell,
                cardCondition: (card) => !card.exhausted
            }))
        });
    }
}

BlackcloudNinja.id = 'blackcloud-ninja';

module.exports = BlackcloudNinja;
