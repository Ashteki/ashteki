class Dice {
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
        return dice.map((dt, i) => {
            return { id: i + 1, magic: dt, level: levels[this.getRandomInt(6)] };
        });
    }
}

module.exports = Dice;
