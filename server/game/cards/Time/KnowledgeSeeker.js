const Card = require('../../Card.js');

class KnowledgeSeeker extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.filterDeck((context) => ({
                amount: 3,
                target: context.player
            }))
        });

        this.destroyed({
            inexhaustible: true,
            optional: true,
            activePromptTitle: 'Bequest 1',
            gameAction: ability.actions.draw()
        });
    }
}

KnowledgeSeeker.id = 'knowledge-seeker';

module.exports = KnowledgeSeeker;
