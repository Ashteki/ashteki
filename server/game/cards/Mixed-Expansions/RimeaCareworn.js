const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');
const DiceCount = require('../../DiceCount.js');

class RimeaCareworn extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Visions',
            cost: ability.costs.sideAction(),
            target: {
                mode: 'options',
                activePromptTitle: "Visions: Choose a player's deck",
                options: [
                    { name: 'Mine', value: false },
                    { name: "Opponent's", value: true }
                ],
                handler: (option) => (this.chosenValue = option.value)
            },
            gameAction: ability.actions.rearrangeCards((context) => ({
                target: this.chosenValue ? context.player.opponent : context.player,
                purge: 0
            })),
            then: {
                cost: [
                    ability.costs.dice([new DiceCount(1, Level.Basic)],
                        'Move top of deck to the bottom?'
                    )],
                gameAction: ability.actions.moveToBottom((context) => ({
                    target: this.chosenValue
                        ? context.player.opponent.deck[0]
                        : context.player.deck[0]
                })),
                message: '{0} moves 1 card from the top of their deck to the bottom',
                messageArgs: (context) => [context.player]
            },
            preferActionPromptMessage: true
        });
    }
}

RimeaCareworn.id = 'rimea-careworn';

module.exports = RimeaCareworn;
