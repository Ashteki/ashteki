const ChimeraCard = require('../../../solo/ChimeraCard');

class FloodOfMoonCove extends ChimeraCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);
    }

    getImageStub() {
        const level = this.level === 'H' ? 'heroic' : 'standard';
        return `flood-of-moon-cove-1p-${level}-${this.stage}.jpg`;
    }

    get setup() {
        const levelStage = this.level + this.stage;
        switch (levelStage) {
            case 'S1':
                return [1, 2, 1, 2];
            case 'S2':
                return [1, 2, 1, 2, 2];
            case 'S3':
                return [1, 2, 1, 2, 1, 2];
            case 'H1':
                return [1, 2, 1, 2, 1];
            case 'H2':
                return [1, 2, 1, 2, 1, 2];
            case 'H3':
                return [1, 2, 1, 2, 1, 2, 1];
            default:
                throw new Error('unrecognised chimera level / stage');
        }
    }

    get life() {
        switch (this.level) {
            case 'S':
                return 35;
            case 'H':
                return 40;
            default:
                throw new Error('unrecognised chimera level');
        }
    }
}

FloodOfMoonCove.id = 'flood-of-moon-cove';

module.exports = FloodOfMoonCove;
