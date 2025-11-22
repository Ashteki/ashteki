describe('Aerial Strike', function () {
    describe('Action Spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['supercharge'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['spark-drone'],
                    inPlay: ['anchornaut'],
                    hand: ['aerial-strike', 'purge']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-rhino'],
                    spellboard: []
                }
            });
        });

        it('deal 3 damage to opponent pb if pb airborne', function () {
            this.player1.attachDie(0, this.arrenFrostpeak);
            expect(this.arrenFrostpeak.isAirborne).toBe(true);
            this.player1.play(this.aerialStrike);
            this.player1.clickDie(2);
            this.player1.clickCard(this.ironRhino);
            expect(this.ironRhino.damage).toBe(3);
        });

        it('no effect if not pb airborne', function () {
            expect(this.arrenFrostpeak.isAirborne).toBe(false);
            this.player1.play(this.aerialStrike);
            this.player1.clickDie(2);
            this.player1.clickCard(this.ironRhino);
            expect(this.ironRhino.damage).toBe(0);
        });
    });
});
