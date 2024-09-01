const { BattlefieldTypes } = require('../../../constants.js');
const Card = require('../../Card.js');

class UmbralAcrobat extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();

        //TODO: Invert
        this.forcedReaction({
            title: 'Invert',
            when: {
                onAttackersDeclared: (event, context) => {
                    return event.attackers.includes(context.source);
                }
            },
            target: {
                activePromptTitle: 'Choose a unit to Invert',
                optional: true,
                cardType: BattlefieldTypes,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilEndOfTurn',
                    effect: [
                        ability.effects.setAttack(() => {
                            const printedLife =
                                context.target.mostRecentEffect('setPrintedLife') ||
                                context.target.printedLife;
                            return Math.max(
                                0,
                                printedLife + context.target.sumEffects('modifyAttack')
                            );
                        }),
                        ability.effects.setLife(() => {
                            const printedAttack =
                                context.target.mostRecentEffect('setPrintedAttack') ||
                                (context.target.printedAttack == 'X'
                                    ? context.target.mostRecentEffect('setPrintedAttack')
                                    : context.target.printedAttack);
                            return Math.max(
                                0,
                                printedAttack + context.target.sumEffects('modifyLife')
                            );
                        })
                    ]
                }))
            }
        });
    }
}

UmbralAcrobat.id = 'umbral-acrobat';

module.exports = UmbralAcrobat;
