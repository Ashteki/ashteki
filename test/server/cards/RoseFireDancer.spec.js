describe('rose fire dancer ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'saria-guideman',
                inPlay: ['rose-fire-dancer'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: []
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                spellboard: [],
                hand: ['rins-fury'],
                dicepool: ['natural', 'natural']
            }
        });
    });

    it('ability places exhaustion token', function () {
        expect(this.hammerKnight.exhausted).toBe(false);

        this.player1.clickCard(this.roseFireDancer);
        this.player1.clickPrompt('Distract');
        this.player1.clickDie(1);
        this.player1.clickCard(this.hammerKnight);

        expect(this.hammerKnight.exhausted).toBe(true);
    });
});
