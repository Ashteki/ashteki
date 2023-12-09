const Card = require('../../Card.js');

class ImperialNinja extends Card {
    setupCardAbilities(ability) {
        // Interrogate: When this unit is declared as an attacker, look at 1 random card in
        //  a target opponent's hand. That target player may discard 2 cards off the top of
        // their draw pile. If they discard fewer than 2 cards, they must discard the looked at card.
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            target: {
                toSelect: 'player',
                autoTarget: (context) => context.player.opponent,
                gameAction: ability.actions.exposeRandom()
            },
            then: {
                gameAction: ability.actions.chooseAction((context) => {
                    const revealedCard = context.preThenEvent.context.cardsRevealed[0];
                    const choices = {
                        ['Discard ' + revealedCard.name]: ability.actions.discard({
                            showMessage: true,
                            player: context.player.opponent,
                            target: revealedCard
                        })
                    };
                    if (context.player.opponent.deck.length >= 2) {
                        choices['Discard 2 top of deck'] = ability.actions.discardTopOfDeck({
                            amount: 2,
                            target: context.player.opponent
                        });
                    }

                    return {
                        player: context.player.opponent,
                        choices: choices
                    };
                })

            }
        });
    }
}

ImperialNinja.id = 'imperial-ninja';

module.exports = ImperialNinja;
