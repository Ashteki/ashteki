const { CardType, Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class Hurricane extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a card to remove 1 exhaustion from',
                showCancel: true,
                cardType: [CardType.Phoenixborn, CardType.ReadySpell],
                gameAction: ability.actions.removeExhaustion()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    targetsPlayer: true,
                    toSelect: 'die',
                    mode: 'upTo',
                    numDice: 3,
                    owner: 'opponent',
                    gameAction: ability.actions.lowerDie()
                },
                then: {
                    alwaysTriggers: true,
                    target: {
                        ignoreTargetCheck: true,
                        autoTarget: (context) => context.player.opponent.unitsInPlay,
                        gameAction: ability.actions.orderedAoE({
                            gameAction: ability.actions.dealDamage(),
                            promptTitle: 'Hurricane'
                        })
                    }
                }
            }
        });
    }
}

Hurricane.id = 'hurricane';

module.exports = Hurricane;
