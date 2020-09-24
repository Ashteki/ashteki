const GameObject = require('./GameObject');

class Die extends GameObject {
    constructor(owner, dieData) {
        super(owner.game);
        // this.owner = owner;
        // this.data = dieData;
        this.id = dieData.id;
        this.magic = dieData.magic;
        this.level = dieData.level;
    }

    getSummary() {
        //let selectionState = activePlayer.getCardSelectionState(this);

        let state = {
            id: this.id,
            magic: this.magic,
            level: this.level
        };

        // return Object.assign(state, selectionState);
        return state;
    }
}

module.exports = Die;
