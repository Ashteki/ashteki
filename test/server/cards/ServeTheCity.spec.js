describe('Serve The City', function () {
    describe("Serve The City's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    spellboard: ['serve-the-city', 'frost-bite'],
                    dicepool: ['ceremonial', 'ceremonial', 'charm', 'natural'],
                    archives: ['bone-crow']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit'],
                    spellboard: []
                }
            });
        });

        it('damage and buff own unit, then attack', function () {
            this.player1.clickCard(this.serveTheCity);
            this.player1.clickPrompt('Serve the City');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.damage).toBe(1);
            expect(this.ironWorker.attack).toBe(3);

            // attack
            this.player1.clickCard(this.mistSpirit);

            this.player2.clickDone();
            this.player2.clickNo();
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.ironWorker.location).toBe('play area');
        });
    });
});
