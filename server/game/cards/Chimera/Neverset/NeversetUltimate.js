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
                        aim: 'right',
                        numCards: 2,
                        gameAction: AbilityDsl.actions.sequentialForEach({
                            forEach: (context) => context.target,
                            action: AbilityDsl.actions.attachConjuredAlteration({
                                conjuredAlteration: 'bleed'
                            })
                        })
                    },
                    then: {
                        gameAction: AbilityDsl.actions.addToThreatZone({ amount: 2 })
                    }
                });
            case 3: return this.ultimate({
                gameAction: AbilityDsl.actions.chosenDiscard({
                    location: ['hand', 'spellboard'],
                    allowTopOfDeck: true
                })
            })
        }
    }
}

NeversetUltimate.id = 'neverset-ultimate';

module.exports = NeversetUltimate;
