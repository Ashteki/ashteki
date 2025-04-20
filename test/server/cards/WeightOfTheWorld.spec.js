describe('Weight Of The World', function () {
    describe('action spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    dicepool: ['sympathy', 'charm', 'divine', 'charm'],
                    hand: ['farewell', 'weight-of-the-world', 'regress']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frostback-bear', 'iron-worker', 'butterfly-monk'],
                    spellboard: [],
                    deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
                }
            });
        });

        it('move alteration from my pb to target unit', function () {
            this.odetteDiamondcrest.exhaust();
            expect(this.frostbackBear.exhausted).toBe(false);
            this.player1.play(this.weightOfTheWorld);
            this.player1.clickDie(0);

            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
            this.player1.clickCard(this.frostbackBear);

            expect(this.frostbackBear.exhausted).toBe(true);
            expect(this.odetteDiamondcrest.exhausted).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
