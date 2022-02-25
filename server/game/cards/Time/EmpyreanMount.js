const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class EmpyreanMount extends Card {
    setupCardAbilities(ability) {
        this.dismount();

        //Battlemaster
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker and the target is a Phoenixborn
                    return (b) =>
                        b.attacker === context.source && b.target.type === CardType.Phoenixborn;
                }
            },
            target: {
                activePromptTitle: 'Choose a unit to force it to block',
                optional: true,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                cardCondition: (card, context) =>
                    card !== context.source && card.canBlock(context.source),
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    effect: ability.effects.forceBlock(context.source), //TODO: Use this effect to lock the attacker and blocker together
                    duration: 'untilEndOfTurn'
                })),
                //TODO: Not sure if the following is working correctly. I am trying to use the AttackState function to start the units off in battle
                // Perhaps this could occur at the start of ChooseDefendersPrompt?
                then: {
                    gameAction: (context) => {
                        this.attack.setBlockerForAttacker(
                            context.preThenEvent.target,
                            context.source
                        );
                    }
                }
            }
        });
    }
}

EmpyreanMount.id = 'empyrean-mount';

module.exports = EmpyreanMount;
