const { BattlefieldTypes, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class SkybreakCaptain extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                toSelect: 'die',
                autoTarget: (context) =>
                    context.player.findDie((die) => die.magic === Magic.Astral && die.exhausted),
                gameAction: ability.actions.resolveDieAbility((context) => ({
                    targetCard: context.source
                }))
            }
        });

        this.action({
            condition: (context) => context.source.isAirborne,
            title: 'Aerial Command 1',
            cost: [ability.costs.sideAction()],
            target: {
                showCancel: true,
                activePromptTitle: 'Choose a unit to give +1 Attack to',
                cardType: BattlefieldTypes,
                controller: 'self',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyAttack(this.getAbilityNumeric(1))
                }))
            }
        });
    }
}

SkybreakCaptain.id = 'skybreak-captain';

module.exports = SkybreakCaptain;
