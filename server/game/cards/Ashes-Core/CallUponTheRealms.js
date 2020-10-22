const Card = require('../../Card.js');

class CallUponTheRealms extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'Change 3 dice in your active pool to a side of your choice',
            target: {
                toSelect: 'die',
                dieCondition: (d) => !d.exhausted,
                mode: 'upTo',
                numDice: 3,
                owner: 'self',
                gameAction: ability.actions.setDieLevel({ level: 'power' }) //todo: choice
            }
        });
    }
}

CallUponTheRealms.id = 'call-upon-the-realms';

module.exports = CallUponTheRealms;
