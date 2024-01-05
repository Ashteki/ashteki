describe('Summon Shimmer Wing', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-shimmer-wing'],
                    dicepool: ['charm', 'charm', 'natural', 'natural'],
                    archives: ['shimmer-wing']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a shimmer wing into play', function () {
            this.player1.clickCard(this.summonShimmerWing);
            this.player1.clickPrompt('Summon Shimmer Wing');
            expect(this.player1.hand.length).toBe(1);
            expect(this.shimmerWing.location).toBe('play area');
        });
    });
});
