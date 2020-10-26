const Card = require('../../Card.js');

class IronWorker extends Card {
    setupCardAbilities(ability) {
        //todo: rework this later - not working now. Onpreparephasedraw event is commented out.
        this.reaction({
            when: {
                onPreparePhaseDraw: (event, context) => {
                    return context.player == context.source.owner;
                }
            },
            optional: true,
            title: 'Overtime: choose how many extra cards to draw',
            target: {
                mode: 'select',
                choices: {
                    '1': ability.actions.draw({ amount: 1 }),
                    '2': ability.actions.draw({ amount: 2 }),
                    Cancel: () => true
                }
            }
        });
    }
}

IronWorker.id = 'iron-worker';

module.exports = IronWorker;
