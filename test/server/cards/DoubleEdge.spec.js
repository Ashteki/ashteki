describe('Double Edge Action Spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'jericho-reborn',
                inPlay: ['mist-spirit', 'iron-worker'],
                dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                hand: ['double-edge']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                dicepool: ['natural', 'natural']
            }
        });
    });

    it('play with cards in deck', function () {
        this.player1.play(this.doubleEdge);

        expect(this.player1.hand.length).toBe(2);
        this.player1.clickCard(this.player1.hand[0]);
        expect(this.player1.hand.length).toBe(1);
        this.player1.clickCard(this.hammerKnight);
        expect(this.hammerKnight.damage).toBe(1);
        expect(this.rinNorthfell.damage).toBe(1);
    });

    it('no trigger if played without cards in deck', function () {
        this.player1.player.deck = [];
        this.player1.play(this.doubleEdge);

        expect(this.player1.hand.length).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
