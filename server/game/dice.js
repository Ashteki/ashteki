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
        // matched length == number of dice askedfor
        const expectedCount = Dice.getRequiredCount(diceReq);
        return matchedDice.length == expectedCount;
    }

    static getRequiredCount(diceReq) {
        return diceReq.reduce((acc, req) => {
            // if it's a parallel cost then return the count of the first item
            // ASSUMPTION: parallel dice costs will always ask for the same dice count.
            if (Array.isArray(req)) {
                return acc + req[0].count;
            }
            return acc + req.count;
        }, 0);
    }

    static matchDice(dice, diceReq) {
        const availableDice = [...dice];
        const matchedDice = [];
        // sort dice basic -> class -> power so .find() will use class over power dice.
        availableDice.sort((a, b) => (a.level < b.level ? -1 : 1));

        let parallels = diceReq.filter((r) => Array.isArray(r));
        let directs = diceReq.filter((r) => !Array.isArray(r));
        directs
            .sort((a, b) => (a.level > b.level ? -1 : 1)) // power first, then class, then basic
            .forEach((req) => {
                // support requests for multiples
                for (let i = 0; i < req.count; i++) {
                    Dice.findADie(availableDice, req, matchedDice);
                }
            });
        // there should only be one parallel dice cost, but anyway...
        parallels.forEach((p) => {
            p.forEach((item) => {
                //BUG?: assuming a single die return needed... what if count is 2?
                if (Dice.findADie(availableDice, item, matchedDice)) return;
            });
        });
        return matchedDice;
    }

    static findADie(availableDice, req, matchedDice) {
        const die = this.findDie(availableDice, req);

        if (die) {
            const index = availableDice.indexOf(die);
            if (index > -1) {
                availableDice.splice(index, 1);
            }
            matchedDice.push(die);
            return true;
        }
        return false;
    }

    static findDie(dice, req) {
        return dice.find(
            (d) =>
                d.level >= req.level &&
                !d.exhausted &&
                (d.magic == req.magic || req.level == 'basic')
        );
    }
}

module.exports = Dice;
