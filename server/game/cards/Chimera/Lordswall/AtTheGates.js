const AspectCard = require('../../../solo/AspectCard');

class AtTheGates extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'AtTheGates',
            gameAction: ability.actions.summon({
                conjuration: 'rainwalker',
                leftmost: true
            })
        });

        this.forcedInterrupt({
            when: { onRoundEnded: () => true },
            gameAction: ability.actions.summon({
                conjuration: 'rainwalker',
                leftmost: true
            })
        });
    }
}

AtTheGates.id = 'at-the-gates';

module.exports = AtTheGates;
