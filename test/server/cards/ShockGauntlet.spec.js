describe('Shock Gauntlet', function () {
    describe('Attach', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['supercharge'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: ['spark-drone'],
                    inPlay: ['anchornaut', 'thunder-hulk'],
                    hand: ['shock-gauntlet']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    dicepool: ['charm', 'ceremonial', 'natural', 'natural'],
                    spellboard: []
                }
            });
        });

        it('adds stats, moves an artifice die onto the host then deals 1 damage', function () {
            this.player1.attachDie(0, this.supercharge);
            expect(this.supercharge.isCharged).toBe(true);

            this.player1.clickCard(this.shockGauntlet);
            this.player1.clickPrompt('Play This Alteration');
            this.player1.clickCard(this.thunderHulk);
            this.player1.clickDieUpgrade(this.supercharge, 0);

            expect(this.thunderHulk.isCharged).toBe(true);
            expect(this.thunderHulk.attack).toBe(4);

            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);
        });

        it('without available die', function () {
            this.player1.clickCard(this.shockGauntlet);
            this.player1.clickPrompt('Play This Alteration');
            this.player1.clickCard(this.thunderHulk);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
