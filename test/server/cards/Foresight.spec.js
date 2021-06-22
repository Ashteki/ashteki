describe('Foresight', function () {
    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['sympathy', 'natural', 'charm', 'charm'],
                    hand: [],
                    spellboard: ['foresight'],
                    deck: ['anchornaut', 'iron-worker', 'blood-archer']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural']
                }
            });
        });

        it('action: filters 1 card from 2', function () {
            // fix the deck
            this.player1.player.deck = [this.ironWorker, this.anchornaut, this.bloodArcher];

            this.player1.clickCard(this.foresight);
            this.player1.clickPrompt('Foresight');
            this.player1.clickPrompt('Mine');
            this.player1.clickPrompt('anchornaut'); // place on bottom
            this.player1.clickPrompt('iron worker'); // place on top

            expect(this.player1.deck.length).toBe(3);
            expect(this.player1.deck[2].id).toBe('anchornaut'); // anchornaut on bottom
            expect(this.player1.deck[0].id).toBe('iron-worker'); // index 0 is the top
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
