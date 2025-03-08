const { Level } = require('../../../server/constants');
describe(' River Colossus', function () {
    describe(' Rouse 2 ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['river-colossus', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['molten-gold'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'mist-spirit'],
                    spellboard: ['keepsake']
                }
            });
        });

        it('on RC attack may lower 2 dice to add 2 to attack', function () {
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.riverColossus);
            this.player1.clickCard(this.riverColossus);

            this.player1.clickDie(0);
            this.player1.clickDie(1);

            this.player1.clickDone();
            expect(this.player1.dicepool[0].level).toBe(Level.Class);
            expect(this.player1.dicepool[1].level).toBe(Level.Class);
            expect(this.riverColossus.attack).toBe(4);
            expect(this.keepsake.status).toBe(2);
        });
    });
});
