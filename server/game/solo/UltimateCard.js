const { Magic } = require('../../constants');
const AbilityDsl = require('../abilitydsl');
const PvEReadySpell = require('./PvEReadySpell');

class UltimateCard extends PvEReadySpell {
    get isMovable() {
        return false;
    }

    getImageStub() {
        return this.imageStub.replace('%s', this.owner.chimeraPhase);
    }

    createSnapshot() {
        const snapshot = super.createSnapshot();
        snapshot.imageStub = this.imageStub.replace('%s', this.owner.chimeraPhase);
        return snapshot;
    }

    getUltimateAbility(phase) {
        // override this in derived classes
    }

    getUnexhaustAbility() {
        return this.ultimate({
            target: {
                autoTarget: (context) => context.player.ultimate,
                gameAction: AbilityDsl.actions.removeExhaustion({ showMessage: true })
            }
        });
    }

    raiseBasicDragonDice(numDice) {
        return this.ultimate({
            gameAction: AbilityDsl.actions.raiseDie((context) => ({
                target: context.source.owner.getBasicDice(Magic.Dragon, numDice),
                showMessage: true
            }))
        });
    }
}

module.exports = UltimateCard;
