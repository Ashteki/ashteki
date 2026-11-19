const { BattlefieldTypes, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class SmokeBomb extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'upTo',
                numDice: 4,
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose an Artifice die on a card to exhaust',
                    showCancel: true,
                    toSelect: 'die',
                    owner: 'self',
                    dieCondition: (die) => die.magic === Magic.Artifice && die.parent,
                    gameAction: ability.actions.exhaustDie()
                },
                then: {
                    target: {
                        ignoreTargetCheck: true,
                        autoTarget: (context) => context.player.opponent.unitsInPlay,
                        gameAction: ability.actions.orderedAoE({
                            gameAction: ability.actions.dealDamage(),
                            promptTitle: 'Smoke Bomb'
                        })
                    }
                }
            }
        });
    }
}

SmokeBomb.id = 'smoke-bomb';

module.exports = SmokeBomb;
