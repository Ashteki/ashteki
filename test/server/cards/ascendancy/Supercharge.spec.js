describe('Supercharge', function () {
    describe('Action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'issa-brightmore',
                    spellboard: ['supercharge'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: ['spark-drone'],
                    inPlay: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('when charged add 2 attack to unit', function () {
            this.player1.attachDie(1, this.supercharge);
            this.player1.clickCard(this.supercharge);
            this.player1.clickPrompt('Supercharge');
            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.attack).toBe(2);
        });

        it('when not charged does nothing', function () {
            this.player1.clickCard(this.supercharge);
            expect(this.player1).not.toHavePrompt('Supercharge');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
