const { Level } = require('../../../server/constants');
describe(' River Colossus', function () {
    describe(' Rouse 2 ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['iron-worker'],
                    spellboard: ['abundance'],
                    dicepool: ['sympathy', 'natural', 'time', 'charm'],
                    hand: ['molten-gold', 'sandstorm-sage'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'mist-spirit'],
                    spellboard: ['small-sacrifice']
                }
            });
        });

        it('when in play own ready spells are focused an extra level', function () {
            expect(this.abundance.focus).toBe(0);
            this.player1.play(this.sandstormSage);
            this.player1.clickDie(1);
            this.player1.clickDone();

            expect(this.sandstormSage.location).toBe('play area');
            expect(this.abundance.focus).toBe(1);
            expect(this.smallSacrifice.focus).toBe(0);
        });
    });
});
