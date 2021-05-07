describe('Summon Spectral Assassin', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['summon-spectral-assassin'],
                    dicepool: ['charm', 'divine', 'illusion'],
                    archives: ['spectral-assassin'],
                    inPlay: ['iron-worker']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('place ally i control to hand, place SA, draw card', function () {
            const handSize = this.player1.hand.length;
            this.player1.play(this.summonSpectralAssassin);
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.ironWorker); // place in hand
            this.player1.clickCard(this.spectralAssassin); // summon
            this.player1.clickYes(); // draw a card
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.spectralAssassin.location).toBe('play area');
            expect(this.ironWorker.location).toBe('hand');
            expect(this.player1.hand.length).toBe(handSize + 1); // -1 play, + 1 iron worker, +1 draw
        });
    });

    // describe('No allies, just draw', function () {
    //     beforeEach(function () {
    //         this.setupTest({
    //             player1: {
    //                 phoenixborn: 'aradel-summergaard',
    //                 hand: ['summon-spectral-assassin'],
    //                 dicepool: ['charm', 'divine', 'illusion'],
    //                 archives: ['spectral-assassin'],
    //                 inPlay: []
    //             },
    //             player2: {
    //                 phoenixborn: 'coal-roarkwin',
    //                 inPlay: ['hammer-knight'],
    //                 spellboard: []
    //             }
    //         });
    //     });

    //     it('place ally i control to hand, place SA, draw card', function () {
    //         const handSize = this.player1.hand.length;
    //         this.player1.play(this.summonSpectralAssassin);
    //         this.player1.clickDie(0);
    //         this.player1.clickPrompt('Done');
    //         this.player1.clickYes(); // draw a card
    //         expect(this.player1).toHaveDefaultPrompt();
    //         expect(this.spectralAssassin.location).toBe('archives');
    //         expect(this.player1.hand.length).toBe(handSize); // -1 play, +1 draw
    //     });
    // });
});
