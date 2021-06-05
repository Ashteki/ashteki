const Card = require('../../Card.js');

class ReapingAngel extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                optional: true,
                activePromptTitle: 'Choose a card to discard',
                location: 'deck',
                controller: 'self',
                gameAction: [
                    ability.actions.reveal(),
                    ability.actions.moveCard({ destination: 'discard' }),
                    ability.actions.shuffleDeck()
                ]
            },
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose a card to remove from the game',
                    optional: true,
                    location: 'discard',
                    controller: 'self',
                    gameAction: [
                        ability.actions.purge(),
                        ability.actions.removeDamage((context) => ({
                            target: context.player.phoenixborn,
                            showMessage: true
                        }))
                    ]
                }
            }
        });
    }
}

ReapingAngel.id = 'reaping-angel';

module.exports = ReapingAngel;
