describe('Bolster ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['hammer-knight'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: ['molten-gold'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage']
            }
        });
    });

    it('Bolster and then Spark', function () {
        this.player1.clickCard(this.luluFirststone);
        this.player1.clickPrompt('Bolster');
        this.player1.clickDie(0);
        expect(this.player1).not.toBeAbleToSelect(this.fluteMage);
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.spark);

        expect(this.hammerKnight.upgrades.length).toBe(1);
        expect(this.hammerKnight.attack).toBe(4);
        expect(this.hammerKnight.status).toBe(1);

        this.player1.clickCard(this.spark);
        this.player1.clickPrompt('Spark');
        this.player1.clickCard(this.fluteMage);
        expect(this.fluteMage.damage).toBe(1);
        expect(this.spark.location).toBe('archives');
    });
});
