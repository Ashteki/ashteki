const _ = require('underscore');
const { CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class GatesThrownOpen extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Gates Thrown Open',
            gameAction: ability.actions.chosenUnexhaust((context) => ({
                target: context.player,
                cardType: CardType.ReadySpell,
                unique: true,
                amount: _.uniq(
                    context.player.spellboard.filter((c) => c.exhausted),
                    (c) => c.name
                ).length
            }))
        });
    }
}

GatesThrownOpen.id = 'gates-thrown-open';

module.exports = GatesThrownOpen;
