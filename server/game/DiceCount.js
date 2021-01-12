class DiceCount {
    constructor(count, level, magic) {
        this.count = count;
        this.level = level;
        this.magic = magic;
    }

    getSummary() {
        return {
            count: this.count,
            level: this.level,
            magic: this.magic
        };
    }
}

module.exports = DiceCount;
