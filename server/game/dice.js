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

    // can diceReq be matched from the collection of dice?
    static canMatch(dice, diceReq) {
        const matchedDice = this.matchDice(dice, diceReq);
        return matchedDice.length == diceReq.length;
    }

    static matchDice(dice, diceReq) {
        const availableDice = [...dice];
        const matchedDice = [];

        diceReq
            .sort((a, b) => (a.level < b.level ? -1 : 1))
            .forEach((req) => {
                const die = this.findDie(availableDice, req);

                if (die) {
                    const index = availableDice.indexOf(die);
                    if (index > -1) {
                        availableDice.splice(index, 1);
                    }
                    matchedDice.push(die);
                }
            });
        return matchedDice;
    }

    static findDie(dice, req) {
        return dice.find(
            (d) =>
                d.level == req.level &&
                !d.exhausted &&
                (d.magic == req.magic || req.level == 'basic')
        );
    }
}

module.exports = Dice;
