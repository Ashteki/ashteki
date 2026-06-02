describe('Gust Spear', function () {
    describe('Attach', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['supercharge'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['spark-drone'],
                    inPlay: ['anchornaut'],
                    hand: ['gust-spear']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    dicepool: ['charm', 'ceremonial', 'natural', 'natural'],
                    spellboard: []
                }
            });
        });

        it('adds stats and smuggles an artifice die onto the host', function () {
            this.player1.clickCard(this.gustSpear);
            this.player1.clickPrompt('Play This Alteration');
            this.player1.clickCard(this.anchornaut);
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);
            this.player1.clickDone();
            expect(this.anchornaut.attack).toBe(1);
            expect(this.player2.dicepool[0].level).toBe('class');
            expect(this.player2.dicepool[1].level).toBe('class');
        });
    });
});
