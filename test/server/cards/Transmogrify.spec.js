describe('Transmogrify', function () {
    describe('action spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    dicepool: ['sympathy', 'charm', 'divine', 'charm'],
                    hand: ['farewell', 'transmogrify', 'regress']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frostback-bear', 'iron-worker', 'butterfly-monk'],
                    spellboard: [],
                    deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
                }
            });
        });

        it('move alteration from target unit to another', function () {
            this.player1.attachUpgrade(this.regress, this.ironWorker);
            expect(this.ironWorker.attack).toBe(0);

            this.player1.play(this.transmogrify);

            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.regress);
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
            this.player1.clickCard(this.frostbackBear);

            expect(this.ironWorker.attack).toBe(2);
            expect(this.frostbackBear.attack).toBe(0);
            expect(this.regress.parent).toBe(this.frostbackBear);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
