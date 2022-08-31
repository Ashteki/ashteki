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

            // check spellboard is still just 1
            expect(this.player1.spellboard.length).toBe(1);
            // Butterfly monk is now on the battlefield
            expect(this.player1.inPlay.length).toBe(1);
        });
    });

    describe('Summon with empty archives', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['butterfly-monk'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('triggers but no monk', function () {
            expect(this.player1.dicepool[0].exhausted).toBe(false);
            this.player1.clickCard(this.summonButterflyMonk);
            this.player1.clickPrompt('Summon Butterfly Monk');

            // check spellboard is still just 1
            expect(this.player1.dicepool[0].exhausted).toBe(true);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
