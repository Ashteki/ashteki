describe('Changing Winds', function () {
    describe('enters spellboard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['sympathy', 'sympathy', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['changing-winds', 'freezing-blast']
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

        it('optional draw when played', function () {
            let hand = this.player1.hand.length;
            this.player1.clickCard(this.changingWinds);
            this.player1.clickPrompt('Play this ready spell');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Yes'); // draw

            this.player1.clickCard(this.player1.hand[0]);
            this.player1.clickPrompt('Bottom');
            this.player1.clickCard(this.player1.hand[0]);
            this.player1.clickPrompt('Bottom');

            expect(this.player1.hand.length).toBe(hand - 1); // -1 for playing card
        });
    });
});
