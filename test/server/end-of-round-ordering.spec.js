describe('End of round event', function () {
    describe('ordering when not active player', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'divine', 'divine', 'natural'],
                    archives: ['ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['brilliant-thorn', 'indiglow-creeper'],
                    spellboard: [],
                    archives: ['luminous-seedling']
                }
            });
        });

        it('should prompt the controller to resolve in order', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone(); // keep dice
            this.player2.clickDone();
            // these are player2 cards, so player 2 should have the prompt
            expect(this.player2).toHavePrompt('choose reaction order');
            this.player2.clickCard(this.brilliantThorn);
            this.player2.clickDone();
            expect(this.indiglowCreeper.location).toBe('archives');
            expect(this.brilliantThorn.location).toBe('archives');
        });
    });
});
