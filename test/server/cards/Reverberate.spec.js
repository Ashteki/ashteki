describe('Reverberate', function () {
    describe('Without discarded copies', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['sympathy', 'natural', 'time', 'charm'],
                    hand: ['reverberate'],
                    archives: ['spark'],
                    deck: ['purge', 'sympathy-pain', 'abundance']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman']
                }
            });
        });

        it('deals 1 damage once', function () {
            this.player1.player.deck = [this.purge, this.sympathyPain, this.abundance];
            expect(this.purge.location).toBe('deck');
            this.player1.play(this.reverberate);
            this.player1.clickCard(this.ironRhino);

            expect(this.ironRhino.damage).toBe(1);
            expect(this.purge.location).toBe('hand');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('With one discarded copy', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['sympathy', 'natural', 'time', 'charm'],
                    hand: ['reverberate'],
                    archives: ['spark'],
                    deck: ['purge', 'sympathy-pain', 'abundance'],
                    discard: ['reverberate']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman']
                }
            });
        });

        it('deals 1 damage twice', function () {
            this.player1.player.deck = [this.purge, this.sympathyPain, this.abundance];

            this.player1.play(this.reverberate);
            this.player1.clickCard(this.ironRhino);
            this.player1.clickCard(this.sonicSwordsman);

            expect(this.ironRhino.damage).toBe(1);
            expect(this.sonicSwordsman.damage).toBe(1);
            expect(this.purge.location).toBe('hand');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
