const { BattlefieldTypes, PhoenixbornTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class EmpyreanMount extends Card {
    setupCardAbilities(ability) {
        this.dismount();

        //Battlemaster
        this.forcedReaction({
            when: {
                onAttackersDeclared: (event, context) => {
                    // I'm the attacker and the target is a Phoenixborn
                    return (
                        event.attackers.includes(context.source) &&
                        PhoenixbornTypes.includes(event.target.type)
                    );
                }
            },
            target: {
                activePromptTitle: 'Choose a unit to force it to block',
                optional: true,
                cardType: BattlefieldTypes,
                controller: 'opponent',
                cardCondition: (card, context) =>
                    card !== context.source && card.canBlock(context.source),
                gameAction: [
                    ability.actions.cardLastingEffect((context) => ({
                        effect: ability.effects.forceBlock(context.source), //TODO: Use this effect to lock the attacker and blocker together
                        duration: 'untilEndOfTurn'
                    })),
                    ability.actions.setBlocker((context) => ({
                        attacker: context.source
                    }))
                ]
            }
        });
    }
}

EmpyreanMount.id = 'empyrean-mount';

module.exports = EmpyreanMount;
