const AbilityDsl = require('../../../abilitydsl');
const UltimateCard = require('../../../solo/UltimateCard');

class IndiriUltimate extends UltimateCard {
    // dragonborn ultimate is Db activated/status ability each turn
    getUltimateAbility(phase) {
        switch (phase) {
            case 1:
                return this.raiseBasicDragonDice(1);
            case 2:
                return this.raiseBasicDragonDice(1);
            case 3:
                return this.raiseBasicDragonDice(2);
        }
    }

    getProgressAbility(phase) {
        switch (phase) {
            case 1:
                return this.damageLeftmost(2, this.getSummonArrowDefinition(1));
            case 2:
                return this.damageLeftmost(3, this.getSummonArrowDefinition(2));
            case 3:
                return this.ultimate(this.getSummonArrowDefinition(3));
        }
    }

    getSummonArrowDefinition(numArrows) {
        const count = Math.min(
            numArrows,
            this.owner.archives.filter((c) => c.id.includes('arrow')).length
        );
        return {
            alwaysTriggers: true,
            gameAction: AbilityDsl.actions.sequentialForEach({
                num: count,
                action: AbilityDsl.actions.summon((context) => ({
                    conjuration: context.player.getRandomArrow()
                }))
            })
        };
    }
}

IndiriUltimate.id = 'indiri-ultimate';

module.exports = IndiriUltimate;
