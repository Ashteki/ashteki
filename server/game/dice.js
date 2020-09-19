class Dice {
    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static getDice() {
        let magic = ['ceremonial', 'charm', 'divine', 'illusion', 'natural', 'sympathy', 'time'];
        let levels = ['power', 'class', 'class', 'class', 'basic', 'basic'];
        let output = [];
        for (var i = 0; i < 10; i++) {
            var m = this.getRandomInt(7);
            var l = this.getRandomInt(6);
            output.push({ id: i + 1, magic: magic[m], level: levels[l] });
        }
        return output;
    }
}

module.exports = Dice;
