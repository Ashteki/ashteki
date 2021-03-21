const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class Resonance extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Resonance',
            target: {
                controller: 'self',
                cardType: CardType.ReadySpell,
                cardCondition: (card) => card.id !== 'resonance',
                location: 'spellboard',
                gameAction: ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: false,
                    postHandler: (context) => (context.source.actsAs = context.target.id)
                }))
            },
            effect: 'focus {1}',
            effectArgs: (context) => context.target,
            then: {
                target: {
                    toSelect: 'die',
                    mode: 'upTo',
                    numDice: 2,
                    owner: 'self',
                    gameAction: [
                        ability.actions.readyDie(),
                        ability.actions.setDieLevel({ level: 'power' })
                    ]
                },
                message: '{0} uses {1} to ready and raise 2 dice',
                messageArgs: (context) => [context.player, context.source]
            }
        });

        this.forcedReaction({
            when: {
                onCardLeavesPlay: (event, context) =>
                    event.card.id === context.source.cardSlot && // it's in my slot
                    //
                    context.player.spellboard.filter(
                        (c) => c.id === context.source.cardSlot && c !== context.source
                    ).length === 0
            },
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                cancel: false,
                postHandler: (context) => (context.source.actsAs = context.source.id)
            })),
            preferActionPromptMessage: true
        });
    }
}

Resonance.id = 'resonance';

module.exports = Resonance;
