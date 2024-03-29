const Card = require('../../Card.js');

class OrrickGilstream extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            // optional: true,
            may: 'use Insight',
            title: 'Insight',
            cost: ability.costs.exhaust(),
            when: {
                onMeditated: (event, context) =>
                    event.firstTopOfDeck && event.player == context.player
            },
            gameAction: ability.actions.moveCard((context) => ({
                destination: 'hand',
                target: context.event.firstTopOfDeck
            }))
        });
    }
}

OrrickGilstream.id = 'orrick-gilstream';

module.exports = OrrickGilstream;
