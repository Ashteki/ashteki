describe('Phoenix Barrage', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: ['tsunami-shot'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman']
            }
        });
    });

    it('damage to 2 units then exit (up to 4)', function () {
        this.player1.play(this.tsunamiShot);
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDone();
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.ironRhino);
        this.player1.clickDone();

        expect(this.fluteMage.damage).toBe(1);
        expect(this.ironRhino.damage).toBe(1);

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('damage to 4 units, repeating one target', function () {
        this.player1.play(this.tsunamiShot);
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDone();
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.ironRhino);
        this.player1.clickCard(this.ironRhino);
        this.player1.clickCard(this.ironRhino);

        expect(this.fluteMage.damage).toBe(1);
        expect(this.ironRhino.damage).toBe(3);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
