const { Level, Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class Photovoltaics extends Card {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.sideAction(),
            location: 'spellboard',
            gameAction: ability.actions.conditional({
                condition: (context) => context.source.status < 3,
                trueGameAction: ability.actions.sequential([
                    ability.actions.addStatusToken(),
                    ability.actions.raiseDie({
                        promptForSelect: {
                            mode: 'exactly',
                            numDice: 1,
                            activePromptTitle: 'Choose a die to raise 1 level',
                            dieCondition: (die) => die.level !== Level.Power,
                            owner: 'self'
                        },
                        showMessage: true
                    })
                ])
            }),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.source.status === 3 &&
                    context.player.hasDie((d) => d.magic === Magic.Artifice && d.exhausted),
                may: 'resolve an exhausted artifice die',
                cost: [ability.costs.exhaust(), ability.costs.loseStatus(3)],
                target: {
                    toSelect: 'die',
                    autoTarget: (context) =>
                        context.player.findDie(
                            (die) => die.magic === Magic.Artifice && die.exhausted
                        ),
                    gameAction: ability.actions.resolveDieAbility()
                }
            }
        });
    }
}

Photovoltaics.id = 'photovoltaics';

module.exports = Photovoltaics;
