describe('Saria Guideman', function () {
    describe('Hearts Pull ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'saria-guideman',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['cover', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage']
                }
            });
        });

        it('draw then force discard topdeck', function () {
            const deckCount = this.player2.deck.length;
            const handCount = this.player1.hand.length;
            this.player1.clickCard(this.sariaGuideman); // use slash
            this.player1.clickPrompt("Heart's Pull");
            this.player1.clickYes();

            expect(this.player1.hand.length).toBe(handCount + 1);
            expect(this.player2.deck.length).toBe(deckCount - 1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('cannot force discard if own draw is empty', function () {
            this.player1.player.deck = []; // clear deck - cannot draw

            const deckCount = this.player2.deck.length;
            const handCount = this.player1.hand.length;
            this.player1.clickCard(this.sariaGuideman); // use slash
            this.player1.clickPrompt("Heart's Pull");
            // this.player1.clickYes();

            expect(this.player1.hand.length).toBe(handCount);
            expect(this.player2.deck.length).toBe(deckCount);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
