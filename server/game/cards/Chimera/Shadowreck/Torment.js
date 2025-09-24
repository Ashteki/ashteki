const { Magic, Level } = require('../../../../constants');
const AspectCard = require('../../../solo/AspectCard');

class Torment extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.statusAbility({
            log: 'each',
            target: {
                toSelect: 'die',
                autoTarget: (context) => context.player.getBasicDie(Magic.Rage),
                gameAction: ability.actions.rerollDice()
            },
            then: {
                gameAction: ability.actions.conditional({
                    condition: (context) => context.preThenEvent.dice[0].level === Level.Basic,
                    trueGameAction: ability.actions.chosenDiscard({
                        allowTopOfDeck: true
                    })
                })
            }
        });
    }
}

Torment.id = 'torment';

module.exports = Torment;
