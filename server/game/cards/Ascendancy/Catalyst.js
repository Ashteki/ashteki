const { Magic } = require('../../../constants.js');
const Card = require('../../Card.js');

class Catalyst extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw(),
            then: {
                target: {
                    toSelect: 'die',
                    autoTarget: (context) =>
                        context.player.findDie(
                            (die) => die.magic === Magic.Artifice && die.exhausted
                        ),
                    gameAction: ability.actions.resolveDieAbility()
                },
                then: {
                    alwaysTriggers: true,
                    targets: {
                        chosenDie: {
                            activePromptTitle: 'Choose an Artifice die to move',
                            optional: true,
                            toSelect: 'die',
                            owner: 'self',
                            dieCondition: (die) => die.magic === Magic.Artifice && die.parent
                        },
                        targetCard: {
                            dependsOn: 'chosenDie',
                            activePromptTitle: 'Choose a card to move the die to',
                            controller: 'self',
                            optional: true,
                            gameAction: ability.actions.attachDie((context) => ({
                                target: context.targets.targetCard,
                                upgradeDie: context.targets.chosenDie
                            }))
                        }
                    }
                }
            }
        });
    }
}

Catalyst.id = 'catalyst';

module.exports = Catalyst;
