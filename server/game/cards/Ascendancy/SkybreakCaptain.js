const { BattlefieldTypes, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class SkybreakCaptain extends Card {
    setupCardAbilities(ability) {
        this.entersPlay({
            target: {
                activePromptTitle: 'Choose an exhausted Astral die to place on Skybreak Captain',
                optional: true,
                toSelect: 'die',
                owner: 'self',
                dieCondition: (die) => die.magic === Magic.Astral && die.exhausted,
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
                cardType: BattlefieldTypes,
                controller: 'self',
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
