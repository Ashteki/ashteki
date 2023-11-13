const AspectCard = require('../../../solo/AspectCard');

class WildThrow extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: 'Wild Throw',
            target: {
                mode: 'auto',
                aim: 'left',
                gameAction: [
                    ability.actions.attachConjuredAlteration({
                        conjuredAlteration: 'stun'
                    }),
                    ability.actions.moveUnit()
                ]
            },
            preferActionPromptMessage: true
        });
    }
}

WildThrow.id = 'wild-throw';

module.exports = WildThrow;
