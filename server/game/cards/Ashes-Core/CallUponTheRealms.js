const Card = require('../../Card.js');

class CallUponTheRealms extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'change 3 dice in their active pool',
            gameAction: ability.actions.changeDice({
                dieCondition: (die) => !die.exhausted,
                numDice: 3,
                owner: 'self'
            })
        });
    }
}

CallUponTheRealms.id = 'call-upon-the-realms';

module.exports = CallUponTheRealms;
