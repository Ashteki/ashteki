const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class RealmWalker extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Isolate 1',
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker
                    return event.battles.some((b) => b.attacker === context.source);
                }
            },
            condition: (context) => context.player.opponent.unitsInPlay.some((c) => !c.exhausted),
            gameAction: ability.actions.chosenExhaust((context) => ({
                target: context.player.opponent,
                cardType: BattlefieldTypes,
                cardCondition: (card) => !card.exhausted
            }))
        });
    }
}

RealmWalker.id = 'realm-walker';

module.exports = RealmWalker;
