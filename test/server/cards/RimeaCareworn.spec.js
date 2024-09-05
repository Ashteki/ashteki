describe('Rimea Careworn', function () {
    describe('Pb Ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rimea-careworn',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    hand: [],
                    deck: ['augury', 'memorialize', 'purge', 'flute-mage']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural'],
                    hand: ['choke', 'summon-gilder', 'summon-fox-spirit'],
                    deck: ['anchornaut', 'hammer-knight', 'cover']
                }
            });
        });

        it('draw 2 cards then expose 2 from opponent hand', function () {
            let length = this.player1.deck.length;
            expect(length).toBe(4);

            this.player1.clickCard(this.rimeaCareworn);
            this.player1.clickPrompt('Visions');

            expect(this.player1.hand.length).toBe(length - 2);
            expect(this.player1.deck.length).toBe(2);
            expect(this.rimeaCareworn.exhausted).toBe(true);
            expect(this.player1.actions.side).toBe(0);

            this.player1.clickOk();
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
