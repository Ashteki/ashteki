describe('Spectral Assassin ', function () {
    describe('Attack declaration', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['spectral-assassin', 'mist-spirit'],
                    dicepool: ['natural']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('prevents use of reaction spells by opponent', function () {
            expect(this.frostFang.damage).toBe(0);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.frostFang);
            this.player1.clickCard(this.spectralAssassin);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('No');
            expect(this.player2).not.toBeAbleToSelect(this.particleShield);

            expect(this.frostFang.location).toBe('discard');
        });
    });
});
