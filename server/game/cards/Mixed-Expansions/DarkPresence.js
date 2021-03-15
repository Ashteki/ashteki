const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class DarkPresence extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Dark Presence',
            cost: [ability.costs.sideAction(), ability.costs.exhaust()],
            location: 'spellboard',
            target: {
                controller: 'self',
                cardType: BattlefieldTypes,
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.addKeyword({ terrifying: 1 })
                })
            },
            then: {
                alwaysTriggers: true,
                condition: () => this.focus > 0,
                target: {
                    optional: true,
                    controller: 'opponent',
                    cardType: BattlefieldTypes,
                    gameAction: ability.actions.cardLastingEffect({
                        duration: 'untilEndOfTurn',
                        effect: ability.effects.modifyAttack(-1)
                    })
                }
            }
        });
    }
}

DarkPresence.id = 'dark-presence';

module.exports = DarkPresence;
