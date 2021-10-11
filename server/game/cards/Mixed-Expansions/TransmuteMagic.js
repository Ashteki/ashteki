const { Level } = require('../../../constants.js');
const Card = require('../../Card.js');

class TransmuteMagic extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Transmute Magic',
            targets: {
                inactive: {
                    toSelect: 'die',
                    mode: 'upTo',
                    numDice: (context) => context.player.dice.filter((d) => !d.exhausted).length,
                    owner: 'self',
                    dieCondition: (die) => die.exhausted
                },
                active: {
                    dependsOn: 'inactive',
                    toSelect: 'die',
                    mode: 'exactly',
                    owner: 'self',
                    dieCondition: (die) => !die.exhausted,
                    numDice: (context) => context.targets.inactive.length
                }
            },
            gameAction: [
                ability.actions.exhaustDie((context) => ({
                    target: context.targets.active
                })),
                ability.actions.readyDie((context) => ({
                    target: context.targets.inactive
                })),
                ability.actions.setDieLevel((context) => ({
                    target: context.targets.inactive,
                    level: Level.Power // to do: add options to change dice to alternative sides
                }))
            ],
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.changeDice({
                    numDice: 1,
                    owner: 'self'
                }),
                then: {
                    alwaysTriggers: true,
                    condition: (context) => context.player.checkRestrictions('changeOpponentsDice'),
                    gameAction: ability.actions.changeDice({
                        numDice: 1,
                        owner: 'opponent'
                    })
                }
            }
        });
    }
}

TransmuteMagic.id = 'transmute-magic';

module.exports = TransmuteMagic;
