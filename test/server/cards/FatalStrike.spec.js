describe('Fatal Strike', function () {
    describe('Reaction to my unit destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['time', 'time', 'ceremonial', 'ceremonial'],
                    hand: ['fatal-strike'],
                    archives: ['sleeping-widow', 'sleeping-widow']
                }
            });
        });

        it('2 damage to pb', function () {
            this.player1.endTurn(); // pass
            // prompt for fatal strike
            this.player2.clickCard(this.fatalStrike);
            this.player2.clickCard(this.aradelSummergaard);
            expect(this.aradelSummergaard.damage).toBe(2);
        });

        it('2 damage to unit', function () {
            this.player1.endTurn(); // pass
            // prompt for fatal strike
            this.player2.clickCard(this.fatalStrike);
            this.player2.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(2);
        });
    });

});
