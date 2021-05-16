const Card = require('../../Card.js');

class ChangingWinds extends Card {
    setupCardAbilities(ability) {
        this.entersSpellboard({
            may: 'draw 2 cards',
            location: 'spellboard',
            gameAction: ability.actions.draw({
                amount: 2
            }),
            then: {
                target: {
                    location: 'hand',
                    gameAction: ability.actions.returnToDeck({
                        chooseTopBottom: true,
                        reveal: false,
                        shuffle: false
                    })
                },
                then: {
                    target: {
                        location: 'hand',
                        gameAction: ability.actions.returnToDeck({
                            chooseTopBottom: true,
                            reveal: false,
                            shuffle: false
                        })
                    }
                }
            }
        });

        this.action({
            title: 'Changing Winds',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            gameAction: ability.actions.draw(),
            then: {
                gameAction: ability.actions.changeDice({
                    numDice: 1,
                    owner: 'self'
                })
            }
        });
    }
}

ChangingWinds.id = 'changing-winds';

module.exports = ChangingWinds;
