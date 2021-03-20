const Card = require('../../Card.js');

class EmperorLion extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                optional: true,
                activePromptTitle: 'Choose a Law to place in your hand',
                location: 'deck',
                controller: 'self',
                cardCondition: (card) => card.name.startsWith('Law '),
                gameAction: [
                    ability.actions.reveal(),
                    ability.actions.moveCard({ destination: 'hand' })
                ]
            },
            then: {
                target: {
                    activePromptTitle: 'Choose a Law',
                    optional: true,
                    location: 'hand',
                    controller: 'self',
                    cardCondition: (card) => card.name.startsWith('Law '),
                    gameAction: ability.actions.playCard((context) => ({
                        target: context.target,
                        ignoreActionCost: true
                    }))
                    // gameAction: ability.actions.resolveAbility((context) => ({
                    //     ability: new PlayReadySpellAction(context.target, false) // no action cost
                    // }))
                },
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.shuffleDeck()
                }
            }
        });
    }
}

EmperorLion.id = 'emperor-lion';

module.exports = EmperorLion;
