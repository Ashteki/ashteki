const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class Timestopper extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                activePromptTitle: 'Choose a unit to prevent attack, block and guard',
                optional: true,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.cardLastingEffect((context) => {
                    const activePlayer = context.game.activePlayer;
                    return {
                        effect: [
                            ability.effects.cardCannot('attack'),
                            ability.effects.cardCannot('guard'),
                            ability.effects.cardCannot('block')
                        ],
                        until: {
                            onTurnEnded: (event) => event.player !== activePlayer,
                            onRoundEnded: (event) => true
                        }
                    };
                })
            }
        });

        this.reaction({
            isLimited: true,
            when: {
                onCardEntersPlay: (event, context) =>
                    BattlefieldTypes.includes(event.card.type) &&
                    event.card.controller === context.player.opponent
            },
            location: 'hand',
            gameAction: ability.actions.playCard(() => ({
                target: this,
                ignoreActionCost: true,
                isLimited: true,
                playedAsReaction: true
            })),
            preferActionPromptMessage: true
        });
    }
}

Timestopper.id = 'timestopper';

module.exports = Timestopper;
