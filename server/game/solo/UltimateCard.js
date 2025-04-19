const Card = require('../Card');
const ThenAbility = require('../ThenAbility');

class UltimateCard extends Card {
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

    // internal utility method for building a behaviour ability
    ultimate(properties) {
        return new ThenAbility(this.game, this.owner.phoenixborn, properties);
    }
}

module.exports = UltimateCard;
