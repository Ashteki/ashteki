const Card = require('../../Card.js');

class Encore extends Card {
    setupCardAbilities(ability) {
        this.play({
            shortMessage: true,
            title: 'Encore',
            targets: {
                myCard: {
                    activePromptTitle: 'Choose a card to return to your deck',
                    controller: 'self',
                    location: 'discard',
                    showCancel: true,
                    cardCondition: (card) => card.id !== 'encore'
                },
                action: {
                    mode: 'select',
                    dependsOn: 'myCard',
                    player: 'self',
                    activePromptTitle: 'Choose where to return it to',
                    choices: {
                        Top: this.game.actions.returnToDeck((context) => ({
                            reveal: true,
                            target: context.targets.myCard,
                            shuffle: false
                        })),
                        Bottom: this.game.actions.returnToDeck((context) => ({
                            reveal: true,
                            bottom: true,
                            target: context.targets.myCard,
                            shuffle: false
                        }))
                    }
                }
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw()
            }
        });
    }
}

Encore.id = 'encore';

module.exports = Encore;
