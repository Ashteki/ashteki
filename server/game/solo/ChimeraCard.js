const Card = require('../Card');

class ChimeraCard extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.level = 'S';
        this.stage = 1;
    }

    get heroic() {
        return this.level === 'H';
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
                return [1, 2, 1, 1, 2];
            case 'H2':
                return [1, 2, 1, 1, 1, 2];
            case 'H3':
                return [1, 2, 1, 2, 1, 1, 2];
            default:
                throw new Error('unrecognised chimera level / stage');
        }
    }

    getImageStub() {
        const level = this.level === 'H' ? 'heroic' : 'standard';
        return `corpse-of-viros-1p-${level}-${this.stage}.jpg`;
    }

    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onAddToken: (event, context) =>
                    event.type === 'redRains' &&
                    event.card === context.source &&
                    event.card.owner.checkUltimateThreshold()
            },
            gameAction: ability.actions.triggerUltimate()
        });
    }
}

module.exports = ChimeraCard;
