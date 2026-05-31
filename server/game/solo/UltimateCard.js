const AbilityDsl = require('../abilitydsl');
const ThenAbility = require('../ThenAbility');
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

    // internal utility method for building a behaviour ability
    ultimate(properties) {
        return new ThenAbility(this.game, this.owner.phoenixborn, properties);
    }
}

module.exports = UltimateCard;
