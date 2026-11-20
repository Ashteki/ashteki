describe('Recharge', function () {
    describe('Action Spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'issa-brightmore',
                    spellboard: ['supercharge'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: ['spark-drone'],
                    inPlay: ['anchornaut', 'hammer-knight'],
                    hand: ['recharge', 'purge']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
            this.player1.attachDie(0, this.hammerKnight);
            this.hammerKnight.tokens.exhaustion = 1;
            this.hammerKnight.wounds = 2;
        });

        it('remove exhaustion and 2 wounds from a charged unit', function () {
            this.player1.play(this.recharge);
            this.player1.clickCard(this.purge);
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(0);
            expect(this.hammerKnight.exhausted).toBe(false);
        });
    });
});
