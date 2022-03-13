const { Level} = require('../../../constants.js');
const Card = require('../../Card.js');

class DreamlockMage extends Card {
    setupCardAbilities(ability) {
        this.action({
            title: 'Restrict 1',
            cost: [ability.costs.sideAction()],
            target: {
                targetsPlayer: true,
                toSelect: 'die',
                dieCondition: (die) => die.level === Level.Power && !die.exhausted,
                owner: 'opponent',
                gameAction: ability.actions.lowerDie()
            }
            //message: "{0} uses {1} to lower opponent's power die"
        });
    }
}

DreamlockMage.id = 'dreamlock-mage';

module.exports = DreamlockMage;
