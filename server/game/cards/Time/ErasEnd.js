const Card = require('../../Card.js');

class ErasEnd extends Card {
    setupCardAbilities(ability) {
        this.play({
            title: 'Eras End',
            gameAction: ability.actions.raiseEvent({
                eventName: 'onRoundEnded',
                snapshot: true
            })
        });
    }
}

ErasEnd.id = 'eras-end';

module.exports = ErasEnd;
