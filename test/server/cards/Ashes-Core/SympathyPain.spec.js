describe('Sympathy pain reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['cover', 'close-combat']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain']
            }
        });
    });

    it('can be played when my phoenixborn takes damage', function () {
        expect(this.hammerKnight.damage).toBe(0);
        this.player1.clickCard(this.coalRoarkwin); // use slash
        this.player1.clickPrompt('Slash');
        this.player1.clickCard(this.cover); // discard
        this.player1.clickCard(this.sariaGuideman);
        expect(this.player2).toBeAbleToSelect(this.sympathyPain);
        this.player2.clickCard(this.sympathyPain); // click sym pain to play as reaction
        this.player2.clickDie(3);
        this.player2.clickCard(this.hammerKnight); // redirect damage to hammerKnight

        expect(this.hammerKnight.damage).toBe(2);
    });
});
