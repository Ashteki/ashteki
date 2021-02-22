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
                random: true,
                controller: 'opponent',
                location: 'hand',
                gameAction: [
                    ability.actions.reveal(),
                    ability.actions.chooseAction((context) => ({
                        player: context.player.opponent,
                        choices: {
                            ['Discard ' + context.target[0].name]: ability.actions.discard({
                                showMessage: true,
                                player: context.player.opponent
                            }),
                            'Discard 2 top of deck': ability.actions.discardTopOfDeck({
                                amount: 2,
                                target: context.player.opponent
                            })
                        }
                    }))
                ]
            }
        });
    }
}

ImperialNinja.id = 'imperial-ninja';

module.exports = ImperialNinja;
