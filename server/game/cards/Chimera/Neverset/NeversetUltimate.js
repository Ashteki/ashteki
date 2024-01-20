const AbilityDsl = require('../../../abilitydsl');
const UltimateCard = require('../../../solo/UltimateCard');

class NeversetUltimate extends UltimateCard {
    getUltimateAbility(phase) {
        switch (phase) {
            case 1:
                return this.ultimate({
                    target: {
                        mode: 'auto',
                        aim: 'left',
                        gameAction: AbilityDsl.actions.attachConjuredAlteration({
                            conjuredAlteration: 'bleed'
                        })
                    },
                    then: {
                        gameAction: AbilityDsl.actions.addToThreatZone({ amount: 1 })
                    }
                });
            case 2:
                return this.ultimate({
                    target: {
                        mode: 'auto',
                        aim: 'left',
                        gameAction: AbilityDsl.actions.attachConjuredAlteration({
                            conjuredAlteration: 'bleed'
                        })
                    },
                    then: {
                        gameAction: AbilityDsl.actions.addToThreatZone({ amount: 2 })
                    }
                });
        }
    }
}

NeversetUltimate.id = 'neverset-ultimate';

module.exports = NeversetUltimate;
