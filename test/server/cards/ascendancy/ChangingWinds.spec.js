describe('Changing Winds', function () {
    describe('enters spellboard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['sympathy', 'sympathy', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['changing-winds', 'freezing-blast'],
                    deck: ['purge', 'abundance', 'juggle', 'backflip']
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
            this.player1.player.deck = [this.purge, this.abundance, this.juggle, this.backflip];
            let hand = this.player1.hand.length;
            this.player1.clickCard(this.changingWinds);
            this.player1.clickPrompt('Play this ready spell');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickYes(); // draw

            this.player1.clickCard(this.freezingBlast);
            this.player1.clickPrompt('Top');
            this.player1.clickCard(this.purge);
            this.player1.clickPrompt('Top');

            expect(this.player1.hand.length).toBe(hand - 1); // -1 for playing card
            expect(this.player1.deck.length).toBe(4);

            expect(this.player1.deck[1]).toBe(this.freezingBlast);
            expect(this.player1.deck[0]).toBe(this.purge);

            this.player1.useDie(1);
            expect(this.player1.deck.length).toBe(3);
            this.player1.clickDone();
            expect(this.purge.location).toBe('hand');
        });
    });
});
