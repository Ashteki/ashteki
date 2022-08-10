describe('Tidal Shift', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight'],
                spellboard: ['abundance'],
                dicepool: ['natural', 'sympathy', 'time', 'charm'],
                hand: ['tidal-shift'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman']
            }
        });

        this.abundance.tokens.exhaustion = 1;
    });

    it('damage to 2 units then exit (up to 4)', function () {
        this.player1.play(this.tidalShift);
        this.player1.clickCard(this.abundance);
        this.player1.clickCard(this.ironRhino);

        expect(this.abundance.exhausted).toBe(false);
        expect(this.ironRhino.exhausted).toBe(true);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
