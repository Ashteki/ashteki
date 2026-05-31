const { Magic, BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class ShockGauntlet extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyAttack(1)]
        });

        this.forcedReaction({
            when: {
                onCardAttached: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Choose an Artifice die to move',
                optional: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Artifice && die.parent,
                gameAction: ability.actions.attachDie((context) => ({
                    target: context.source.parent,
                    upgradeDie: context.target
                }))
            },
            then: {
                condition: (context) => context.preThenEvent.resolved,
                target: {
                    activePromptTitle: 'Choose a unit to deal 1 damage to',
                    showCancel: true,
                    cardType: BattlefieldTypes,
                    controller: 'opponent',
                    gameAction: this.game.actions.dealDamage()
                }
            }
        });
    }
}

ShockGauntlet.id = 'shock-gauntlet';

module.exports = ShockGauntlet;
