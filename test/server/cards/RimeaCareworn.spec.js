describe('Rimea Careworn', function () {
    describe('Action Spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rimea-careworn',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    hand: [],
                    deck: ['augury', 'memorialize', 'molten-gold']
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

        it('opponent: with 3 cards, rearrange cards then optional cost to bottom the top card', function () {
            this.player2.removeFillerCards();
            let length = this.player2.deck.length;
            expect(length).toBe(3);

            this.player1.clickCard(this.rimeaCareworn);
            this.player1.clickPrompt('Visions');
            this.player1.clickPrompt("Opponent's");

            // return cards firs
            this.player1.clickPrompt('anchornaut'); // bottom
            this.player1.clickPrompt('cover'); // middle
            // automatic HK to top

            expect(this.player2.deck.length).toBe(length);
            expect(this.player2.deck[2].id).toBe('anchornaut'); // anchornaut on bottom
            expect(this.player2.deck[1].id).toBe('cover');
            expect(this.player2.deck[0].id).toBe('hammer-knight'); // index 0 is the top

            this.player1.clickDie(0);
            expect(this.player2.deck[2].id).toBe('hammer-knight'); // HK now on bottom
        });

        it('mine: with 3 cards, rearrange cards then optional cost to bottom the top card', function () {
            this.player1.removeFillerCards();
            let length = this.player1.deck.length;
            expect(length).toBe(3);

            this.player1.clickCard(this.rimeaCareworn);
            this.player1.clickPrompt('Visions');
            this.player1.clickPrompt('Mine');

            // return cards firs
            this.player1.clickPrompt('memorialize'); // bottom
            this.player1.clickPrompt('molten gold'); // middle
            // automatic aug to top

            expect(this.player1.deck.length).toBe(length);
            expect(this.player1.deck[2].id).toBe('memorialize'); // anchornaut on bottom
            expect(this.player1.deck[1].id).toBe('molten-gold');
            expect(this.player1.deck[0].id).toBe('augury'); // index 0 is the top

            this.player1.clickDie(0);
            expect(this.player1.deck[2].id).toBe('augury'); // aug now on bottom
        });
    });
});
