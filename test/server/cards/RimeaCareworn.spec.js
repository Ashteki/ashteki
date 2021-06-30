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
            this.player1.clickPrompt('hammer knight'); // top

            expect(this.player2.deck.length).toBe(length);
            expect(this.player2.deck[2].id).toBe('anchornaut'); // anchornaut on bottom
            expect(this.player2.deck[1].id).toBe('cover');
            expect(this.player2.deck[0].id).toBe('hammer-knight'); // index 0 is the top
            expect(this.rimeaCareworn.exhausted).toBe(false);

            this.player1.clickDie(0);
            expect(this.player2.deck[2].id).toBe('hammer-knight'); // HK now on bottom
            expect(this.rimeaCareworn.exhausted).toBe(true);
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
            this.player1.clickPrompt('augury'); // top

            expect(this.player1.deck.length).toBe(length);
            expect(this.player1.deck[2].id).toBe('memorialize');
            expect(this.player1.deck[1].id).toBe('molten-gold');
            expect(this.player1.deck[0].id).toBe('augury'); // index 0 is the top

            this.player1.clickDie(0);
            expect(this.player1.deck[2].id).toBe('augury'); // aug now on bottom
        });

        it('opponent then me', function () {
            this.player1.removeFillerCards();
            this.player2.removeFillerCards();
            let length = this.player2.deck.length;
            expect(length).toBe(3);

            this.player1.clickCard(this.rimeaCareworn);
            this.player1.clickPrompt('Visions');
            this.player1.clickPrompt("Opponent's");

            // return cards firs
            this.player1.clickPrompt('anchornaut'); // bottom
            this.player1.clickPrompt('cover'); // middle
            this.player1.clickPrompt('hammer knight'); // top

            expect(this.player2.deck.length).toBe(length);
            expect(this.player2.deck[2].id).toBe('anchornaut'); // anchornaut on bottom
            expect(this.player2.deck[1].id).toBe('cover');
            expect(this.player2.deck[0].id).toBe('hammer-knight'); // index 0 is the top

            this.player1.clickDie(0);
            expect(this.player2.deck[2].id).toBe('hammer-knight'); // HK now on bottom
            expect(this.rimeaCareworn.exhausted).toBe(true);
            this.player1.endTurn();
            this.player2.actions.main = false;
            this.player2.endTurn();
            expect(this.player1.deck.length).toBe(3);

            // fudge this to avvoid ending round
            this.rimeaCareworn.tokens.exhaustion = 0;

            this.player1.clickCard(this.rimeaCareworn);
            this.player1.clickPrompt('Visions');
            this.player1.clickPrompt('Mine');

            // return cards firs
            this.player1.clickPrompt('memorialize'); // bottom
            this.player1.clickPrompt('molten gold'); // middle
            this.player1.clickPrompt('augury'); // top

            expect(this.player1.deck.length).toBe(3);
            expect(this.player1.deck[2].id).toBe('memorialize');
            expect(this.player1.deck[1].id).toBe('molten-gold');
            expect(this.player1.deck[0].id).toBe('augury'); // index 0 is the top

            this.player1.clickDie(1);
            expect(this.player1.deck[2].id).toBe('augury'); // aug now on bottom
        });
    });
});
