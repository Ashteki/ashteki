describe('Summon Spectral Assassin', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['summon-spectral-assassin'],
                    dicepool: ['charm', 'divine', 'illusion'],
                    archives: ['spectral-assassin'],
                    deck: ['molten-gold'],
                    inPlay: ['iron-worker']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('return ally I control to hand, place SA, draw card', function () {
            const handSize = this.player1.hand.length;
            this.player1.play(this.summonSpectralAssassin);
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.ironWorker); // place in hand
            this.player1.clickPrompt('SummonAndDraw'); // summon and draw
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.spectralAssassin.location).toBe('play area');
            expect(this.ironWorker.location).toBe('hand');
            expect(this.player1.hand.length).toBe(handSize + 1); // -1 play, + 1 iron worker, +1 draw
        });

        it("return ally I control to hand, place SA, don't draw card", function () {
            const handSize = this.player1.hand.length;
            this.player1.play(this.summonSpectralAssassin);
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.ironWorker); // place in hand
            this.player1.clickPrompt('SummonOnly'); // summon and draw
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.spectralAssassin.location).toBe('play area');
            expect(this.ironWorker.location).toBe('hand');
            expect(this.player1.hand.length).toBe(handSize); // -1 play, + 1 iron worker
        });
    });

    describe('No allies', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['summon-spectral-assassin'],
                    dicepool: ['charm', 'divine', 'illusion'],
                    archives: ['spectral-assassin'],
                    deck: ['molten-gold'],
                    inPlay: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('just draw 1', function () {
            const handSize = this.player1.hand.length;
            this.player1.play(this.summonSpectralAssassin);
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Draw'); // draw a card
            this.player1.clickPrompt('1'); // draw 1 card
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.spectralAssassin.location).toBe('archives');
            expect(this.player1.hand.length).toBe(handSize); // -1 play, +1 draw
        });

        it('just draw 0', function () {
            const handSize = this.player1.hand.length;
            this.player1.play(this.summonSpectralAssassin);
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Draw'); // draw a card
            this.player1.clickPrompt('0'); // draw 0 cards
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.spectralAssassin.location).toBe('archives');
            expect(this.player1.hand.length).toBe(handSize - 1); // -1 play
        });
    });
});
