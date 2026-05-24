const { Level } = require('../../constants');

class BotDicePromptStrategy {
    constructor(player) {
        this.player = player;
    }

    execute(prompt) {
        let selectPool = [];
        // select dice depending on what it's for
        const numDice = prompt.properties.numDice;
        if (prompt.properties.owner === 'self') {
            // choose basic dice
            selectPool = this.player.dice.filter(d => d.level === Level.Basic);
        }

        for (let i = 0; i < numDice && i < selectPool.length; i++) {
            prompt.selectDie(selectPool[i]);
        }

        // prompt.source is card
        prompt.fireOnSelect();
    }
}

module.exports = BotDicePromptStrategy;