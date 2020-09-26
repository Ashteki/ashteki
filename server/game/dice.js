class Dice {
    static countBasic(dice) {
        return dice.filter((d) => d.level === 'basic').length;
    }
    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static rollDice(diceCounts) {
        let dice = [];
        diceCounts.forEach((dc) => {
            for (let i = 0; i < dc.count; i++) {
                dice.push(dc.magic);
            }
        });

        let levels = ['power', 'class', 'class', 'class', 'basic', 'basic'];
        return dice.map((dt) => {
            return {
                magic: dt,
                level: levels[this.getRandomInt(6)],
                exhausted: false
            };
        });
    }
}

module.exports = Dice;
