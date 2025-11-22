describe('Cirrus Ranger', function () {
    describe('On Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['thunder-hulk'],
                    inPlay: ['javelineer'],
                    hand: ['systems-drafter', 'cirrus-ranger']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    spellboard: []
                }
            });
        });

        it('deal 1 damage to opponent pb and lower one active dice by one level', function () {
            this.player1.play(this.cirrusRanger);
            this.player1.clickDie(1);
            this.player1.clickDone();

            this.player1.clickOpponentDie(0);

            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.player2.dicepool[0].level).toBe('class');
        });
    });
});
