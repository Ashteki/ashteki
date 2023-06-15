const { BattlefieldTypes, CardType } = require('../../../constants.js');
const Card = require('../../Card.js');

class ChantOfTransfusion extends Card {
    setupCardAbilities(ability) {
        this.forcedReaction({
            autoResolve: true,
            location: 'spellboard',
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.type === 'Ally' && event.card.controller == context.player
            },
            condition: (context) => context.source.status == 0,
            gameAction: ability.actions.addStatusToken((context) => ({
                amount: 1,
                target: context.source
            }))
        });

        this.action({
            title: 'Transfusion',
            location: 'spellboard',
            cost: [
                ability.costs.chosenAction(),
                ability.costs.exhaust(),
                ability.costs.loseStatus()
            ],
            targets: {
                tokenBoy: {
                    activePromptTitle: 'Choose an target unit to remove a wound from',
                    controller: 'any',
                    cardType: BattlefieldTypes,
                    cardCondition: (card) => card.damage
                },
                receiver: {
                    activePromptTitle: 'Choose a unit to move the wound to',
                    dependsOn: 'tokenBoy',
                    cardType: BattlefieldTypes,
                    controller: 'any',
                    cardCondition: (card, context) => card !== context.targets.tokenBoy,
                    gameAction: ability.actions.moveToken((context) => ({
                        from: context.targets.tokenBoy,
                        to: context.targets.receiver,
                        type: 'damage'
                    }))
                }
            }
        })
    }
}

ChantOfTransfusion.id = 'chant-of-transfusion';

module.exports = ChantOfTransfusion;
