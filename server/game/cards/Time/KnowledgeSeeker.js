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
            may: 'draw cards',
            activePromptTitle: 'Bequest 1',
            gameAction: ability.actions.draw(() => ({
                amount: this.getAbilityNumeric(1)
            }))
        });
    }
}

KnowledgeSeeker.id = 'knowledge-seeker';

module.exports = KnowledgeSeeker;
