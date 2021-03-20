const _ = require('underscore');
const Card = require('../../Card.js');

class GatesThrownOpen extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Gates Thrown Open',
            gameAction: ability.actions.sequentialForEach((context) => ({
                forEach: _.uniq(
                    context.player.spellboard.filter((s) => s.exhausted),
                    (card) => card.name
                ),
                action: ability.actions.removeExhaustion()
            }))
        });
    }
}

GatesThrownOpen.id = 'gates-thrown-open';

module.exports = GatesThrownOpen;
