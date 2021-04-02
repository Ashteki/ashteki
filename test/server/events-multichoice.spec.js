describe('Event Choice', function () {
    describe('During attack on Phoenixborn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['blue-jaguar', 'blue-jaguar']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['anchornaut', 'mist-spirit']
                }
            });
        });

        it('prompting with info on 2 blue jags', function () {
            expect(this.aradelSummergaard.damage).toBe(0); // Damage from iron worker

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard); // target pb
            this.player1.clickCard(this.player1.player.unitsInPlay[0]);
            this.player1.clickCard(this.player1.player.unitsInPlay[1]);
            this.player1.clickPrompt('Done'); // end attacker choice

            // blue jag prompt
            this.player2.clickCard(this.anchornaut);

            // UNFINISHED
        });
    });
});
