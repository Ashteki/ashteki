const ChimeraCard = require('../../../solo/ChimeraCard');

class SpawnOfShadowreck extends ChimeraCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);
    }

    getImageStub() {
        const level = this.level === 'H' ? 'heroic' : 'standard';
        return `spawn-of-shadowreck-1p-${level}-${this.stage}.jpg`;
    }

    get setup() {
        const levelStage = this.level + this.stage;
        switch (levelStage) {
            case 'S1':
                return [1, 2, 2, 2];
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
                return 30;
            case 'H':
                return 35;
            default:
                throw new Error('unrecognised chimera level');
        }
    }
}

SpawnOfShadowreck.id = 'spawn-of-shadowreck';

module.exports = SpawnOfShadowreck;
