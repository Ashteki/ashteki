describe('Canyon Shelter', function () {
    describe('Shelter unit refresh', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['natural', 'time', 'charm', 'charm', 'time'],
                    spellboard: ['fighting-spirit', 'canyon-shelter'],
                    hand: ['iron-worker']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });

            this.hammerKnight.tokens.exhaustion = 1;
            this.hammerKnight.tokens.damage = 1;
        });

        it('place unit under card, return to battle, add status token', function () {
            // poor HK is hurt and exhausted
            expect(this.hammerKnight.exhausted).toBe(true);
            expect(this.hammerKnight.damage).toBe(1);

            this.player1.clickCard(this.canyonShelter);
            this.player1.clickPrompt('Shelter Unit');
            this.player1.clickCard(this.hammerKnight);

            expect(this.hammerKnight.location).toBe('purged');
            expect(this.canyonShelter.childCards.length).toBe(1);
            this.player1.actions.main = false;
            this.canyonShelter.tokens.exhaustion = 0;
            this.player1.endTurn();
            this.player2.endTurn();
            expect(this.canyonShelter.childCards.length).toBe(1);
            this.player1.clickCard(this.canyonShelter);
            this.player1.clickPrompt('Return Unit');
            this.player1.clickPrompt('Hammer Knight');
            // HK returns without tokens, then gets a status token
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.hammerKnight.status).toBe(1);
            expect(this.hammerKnight.exhausted).toBe(false);
            expect(this.hammerKnight.damage).toBe(0);
        });
    });
});
