const { Level } = require("../../../constants");
const Card = require("../../Card");

class Rampage extends Card {
    setupCardAbilities(ability) {
        this.alert();

        this.forcedReaction({
            inexhaustible: true,
            when: {
                // it's my turn
                onBeginTurn: (event, context) => event.player === context.player
            },
            location: 'play area',
            gameAction: ability.actions.removeStatus({ target: this }),
            then: {
                target: {
                    toSelect: 'die',
                    autoTarget: (context) => context.player.dice.filter(d => d.level === Level.Basic),
                    gameAction: ability.actions.rerollDice()
                }
            },
            effect: 'reroll all basic dice'
        });
    }

    get statusCount() {
        return 2;
    }
}

Rampage.id = 'rampage';

module.exports = Rampage