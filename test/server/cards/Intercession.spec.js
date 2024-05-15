describe('Intercession reaction', function () {
    describe('on Opponent attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['nightshade-swallow', 'mist-spirit', 'iron-rhino'],
                    hand: ['intercession'],
                    dicepool: ['divine']
                }
            });
        });

        it('grants unit guard and alert to chosen unit', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.mistSpirit); // target
            this.player1.clickCard(this.ironWorker);

            // reaction
            this.player2.clickCard(this.intercession);
            this.player2.clickCard(this.ironRhino);

            // chose guard
            this.player2.clickCard(this.ironRhino);

            expect(this.ironWorker.location).toBe('discard'); // attacked
            expect(this.ironRhino.damage).toBe(2);
            expect(this.ironRhino.exhausted).toBe(false);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
