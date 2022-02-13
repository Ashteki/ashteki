const Card = require('../../Card.js');

class EmpyreanMount extends Card {
    setupCardAbilities(ability) {
        this.dismount();

        //Battlemaster
    }
}

EmpyreanMount.id = 'empyrean-mount';

module.exports = EmpyreanMount;
