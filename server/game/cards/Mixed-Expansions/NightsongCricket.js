const Card = require('../../Card.js');

class NightsongCricket extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            title: 'Polyphony',
            gameAction: ability.actions.changeDice({
                numDice: 1,
                owner: 'any'
            })
        });

        this.destroyed({
            title: 'Renewed Harmony',
            targets: {
                theirChoice: {
                    activePromptTitle: "Choose a card to return to your opponent's hand",
                    player: 'opponent',
                    controller: 'self',
                    location: 'discard'
                },
                myChoice: {
                    activePromptTitle: "Choose a card to return to your opponent's hand",
                    controller: 'opponent',
                    location: 'discard',
                    gameAction: [
                        ability.actions.moveCard((context) => ({
                            target: context.targets.theirChoice,
                            destination: 'hand'
                        })),
                        ability.actions.moveCard((context) => ({
                            target: context.targets.myChoice,
                            destination: 'hand'
                        }))
                    ]
                }
            }
        });
    }
}

NightsongCricket.id = 'nightsong-cricket';

module.exports = NightsongCricket;
