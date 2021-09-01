const Card = require('../../Card.js');

class ReapingAngel extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                optional: true,
                activePromptTitle: 'Choose an ally to discard',
                location: 'deck',
                controller: 'self',
		        cardType: 'Ally',
                gameAction: [
                    ability.actions.reveal(),
                    ability.actions.moveCard({ destination: 'discard' }),
                    ability.actions.shuffleDeck()
                ]
            }
        });
        this.entersPlay({
            target: {
                activePromptTitle: 'Choose an ally to remove from the game',
                optional: true,
                location: 'discard',
                controller: 'self',
                cardType: 'Ally',
                gameAction: [
                    ability.actions.purge(),
                    ability.actions.removeDamage((context) => ({
                        target: context.player.phoenixborn,
                        showMessage: true
                    }))
                ]
            }
        });
    }
}

ReapingAngel.id = 'reaping-angel';

module.exports = ReapingAngel;
