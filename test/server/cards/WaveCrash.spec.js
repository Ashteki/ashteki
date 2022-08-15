describe('Wave Crash', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight'],
                spellboard: ['abundance'],
                dicepool: ['natural', 'sympathy', 'time', 'charm'],
                hand: ['wave-crash'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman']
            }
        });

        this.hammerKnight.tokens.status = 2;
    });

    it('damage 1 damage to a pb', function () {
        this.player1.play(this.waveCrash);
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.sariaGuideman);

        expect(this.hammerKnight.status).toBe(1);
        expect(this.sariaGuideman.damage).toBe(1);

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('damage 2 damage to a unit', function () {
        this.player1.play(this.waveCrash);
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.ironRhino);

        expect(this.hammerKnight.status).toBe(1);
        expect(this.ironRhino.damage).toBe(2);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
