describe('Rimea Careworn', function () {
    describe('Action Spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rimea-careworn',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    hand: []
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural'],
                    hand: ['choke'],
                    deck: ['anchornaut', 'hammer-knight', 'cover']
                }
            });
        });

        it('discard removes card with no damage', function () {
            this.player2.player.deck = this.player2.deck.filter((c) => c.id !== 'open-memories');
            let length = this.player2.deck.length;

            this.player1.clickCard(this.rimeaCareworn);
            this.player1.clickPrompt('Visions');

            this.player1.clickPrompt('anchornaut'); // bottom
            // return
            this.player1.clickPrompt('cover'); // top

            expect(this.player2.deck.length).toBe(length);
            expect(this.player2.deck[2].id).toBe('anchornaut'); // anchornaut on bottom
            expect(this.player2.deck[1].id).toBe('cover');
            expect(this.player2.deck[0].id).toBe('hammer-knight'); // index 0 is the top

            // anchornaut is in the deck
            expect(this.anchornaut.location).toBe('deck');
        });
    });
});
