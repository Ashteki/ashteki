const Card = require('../../Card.js');

class MindProbe extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Mind Probe',
            gameAction: ability.actions.rearrangeCards((context) => ({
                amount: 5,
                purge: 1,
                target: context.player.opponent,
                reveal: true
            })),
            preferActionPromptMessage: true,
            message: 'test'
        });
    }
}

MindProbe.id = 'mind-probe';

module.exports = MindProbe;
