describe('New Ideas', function () {
    describe('Played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                    hand: ['new-ideas', 'living-doll', 'transmute-magic'],
                    deck: ['anchornaut', 'augury', 'purge']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural']
                }
            });
        });

        it('bottom 1 card, then draw 3', function () {
            let hLength = this.player1.hand.length;
            this.player1.clickCard(this.newIdeas);
            this.player1.clickPrompt('Play this Action');
            // choose exhausted dice
            this.player1.clickPrompt('Side');
            this.player1.clickCard(this.livingDoll);
            expect(this.player1.hand.length).toBe(hLength - 1 - 1 + 3); // -NI, -LD, +3 draw

            expect(this.livingDoll.location).toBe('deck');
        });
    });
});
