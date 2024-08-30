const Card = require('../../Card.js');

class UmbralAcrobat extends Card {
    setupCardAbilities(ability) {
        this.unitGuard();

        //TODO: Invert
    }
}

UmbralAcrobat.id = 'umbral-acrobat';

module.exports = UmbralAcrobat;
