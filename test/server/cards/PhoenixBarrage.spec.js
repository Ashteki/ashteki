describe('Phoenix Barrage', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: ['phoenix-barrage'],
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

    it('damage to 2 units then pb', function () {
        this.player1.play(this.phoenixBarrage);
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDie(2);
        this.player1.clickDone();
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.ironRhino);
        this.player1.clickCard(this.sariaGuideman);

        expect(this.hammerKnight.damage).toBe(2);
        expect(this.ironRhino.damage).toBe(2);
        expect(this.sariaGuideman.damage).toBe(2);
    });
});
