describe('Summon Gilder', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-gilder'],
                    dicepool: ['charm', 'natural', 'natural', 'natural'],
                    archives: ['gilder']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a gilder into play', function () {
            this.player1.clickCard(this.summonGilder);
            this.player1.clickPrompt('Summon Gilder');
            this.player1.clickCard(this.player1.archives[0]);
            expect(this.player1).toBeAbleToSelect(this.gilder);

            expect(this.player1).toHavePromptButton('Done'); // it's optional
            expect(this.player1).toBeAbleToSelect(this.hammerKnight);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);
        });
    });
});
