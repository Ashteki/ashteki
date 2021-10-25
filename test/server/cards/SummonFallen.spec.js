describe('Summon Fallen', function () {
    describe('Summon 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-fallen'],
                    dicepool: ['charm', 'ceremonial', 'natural', 'natural'],
                    archives: ['fallen']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.summonFallen.tokens.status = 1;
        });

        it('should place a fallen into play', function () {
            this.player1.clickCard(this.summonFallen);
            this.player1.clickPrompt('Summon Fallen');
            this.player1.clickCard(this.summonFallen);
            this.player1.clickDone();
            expect(this.fallen.location).toBe('play area');

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.summonFallen.status).toBe(0);
        });
    });

    describe('Summon 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-fallen', 'summon-fallen', 'summon-fallen'],
                    dicepool: ['charm', 'ceremonial', 'natural', 'natural'],
                    archives: ['fallen', 'fallen', 'fallen']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.spellboard[0].tokens.status = 1;
            this.player1.spellboard[1].tokens.status = 1;
            this.player1.spellboard[2].tokens.status = 1;
        });

        it('should place 2 fallen into play', function () {
            expect(this.player1.inPlay.length).toBe(0);
            this.player1.clickCard(this.summonFallen);
            this.player1.clickPrompt('Summon Fallen');
            this.player1.clickCard(this.player1.spellboard[0]);
            this.player1.clickCard(this.player1.spellboard[1]);
            this.player1.clickDone();
            expect(this.player1.inPlay.length).toBe(2);

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player1.spellboard[0].status).toBe(0);
            expect(this.player1.spellboard[1].status).toBe(0);
        });
    });
});
