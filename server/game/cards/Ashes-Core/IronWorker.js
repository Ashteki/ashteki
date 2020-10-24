const Card = require('../../Card.js');

class IronWorker extends Card {
    // setupCardAbilities(ability) {
    // this.reaction({
    //     when: {
    //         onPreparePhaseDraw: (event, context) => true
    //     },
    //     optional: true,
    //     gameAction: ability.actions.draw((context) => {
    //         context.game.promptWithHandlerMenu(context.player, {
    //             activePromptTitle: 'Overtime: Choose how many cards to draw',
    //             context: context,
    //             choices: Array.from(Array(2), (x, i) => i.toString()),
    //             choiceHandler: (choice) => {
    //                 context.amount = parseInt(choice);
    //             }
    //         });
    //         return { amount: context.amount };
    //     })
    // });
    // }
}

IronWorker.id = 'iron-worker';

module.exports = IronWorker;
