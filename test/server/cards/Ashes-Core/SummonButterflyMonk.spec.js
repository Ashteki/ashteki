describe('Summon Butterfly Monk', function () {
    describe("Summon Butterfly Monk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a butterfly monk into play', function () {
            this.player1.clickCard(this.summonButterflyMonk);
            this.player1.clickPrompt('Summon Butterfly Monk');
            this.player1.clickCard('butterfly-monk');

            // check spellboard is still just 1
            expect(this.player1.spellboard.length).toBe(1);
            // Butterfly monk is now on the battlefield
            expect(this.player1.inPlay.length).toBe(1);
        });
    });
});
