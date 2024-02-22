const AbilityDsl = require('../../../abilitydsl');
const AspectCard = require('../../../solo/AspectCard');

class VineWhip extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.entersPlay({
            target: {
                mode: 'auto',
                aim: 'left',
                gameAction: AbilityDsl.actions.attachConjuredAlteration({
                    conjuredAlteration: 'bleed'
                })
            }
        });
    }
}

VineWhip.id = 'vine-whip';

module.exports = VineWhip;
