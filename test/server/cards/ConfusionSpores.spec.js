describe('Confusion Spores', function () {
    describe('Confusion Spores ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['confusion-spores', 'confusion-spores'],
                    dicepool: ['natural', 'sympathy', 'illusion', 'charm'],
                    archives: ['masked-wolf', 'masked-wolf']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('refreshes side action when focussed', function () {
            this.player1.clickCard(this.confusionSpores);

            this.player1.clickPrompt('Confusion Spores');

            this.player1.clickCard(this.hammerKnight);
            expect(this.player1.dicepool[1].exhausted).toBe(false);

            this.player1.clickPrompt('Yes');

            expect(this.player1.player.actions.side).toBe(1);
            expect(this.player1.dicepool[1].exhausted).toBe(true);
        });

        it('does not refresh side action when not chosen', function () {
            this.player1.clickCard(this.confusionSpores);

            this.player1.clickPrompt('Confusion Spores');

            this.player1.clickCard(this.hammerKnight);
            this.player1.clickPrompt('No');

            expect(this.player1.player.actions.side).toBe(0);
            expect(this.player1.dicepool[1].exhausted).toBe(false);
        });
    });
});
