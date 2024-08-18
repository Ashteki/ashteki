class DieStateWriter {
    constructor(die) {
        this.die = die;
    }

    getSummary() {
        let state = {
            id: this.die.magic + '-magic',
            uuid: this.die.uuid,
            magic: this.die.magic,
            level: this.die.level,
            location: this.die.location,
            exhausted: this.die.exhausted,
            menu: this.die.getMenu()
        };
        return state;
    }
}

module.exports = DieStateWriter;