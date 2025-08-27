const Card = require('../../Card.js');

class SpearMaster extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            gameAction: ability.actions.addStatusToken({
                amount: 2
            })
        });

        this.forcedReaction({
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.addStatusToken({
                amount: 2
            })
        });
    }
}

SpearMaster.id = 'spear-master';

module.exports = SpearMaster;
