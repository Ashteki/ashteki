const AspectCard = require('../../../solo/AspectCard');

class WildThrow extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            title: "Giant's Might 1",
            target: {
                mode: 'auto',
                aim: 'left',
                gameAction: [
                    ability.actions.attachConjuredAlteration({
                        conjuredAlteration: 'stun'
                    }),
                    ability.actions.moveUnit()
                ]
            }
        });
    }
}

WildThrow.id = 'wild-throw';

module.exports = WildThrow;
