describe('ChangeOfHeart', function () {
    describe('attached to pb', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['crystal-archer', 'mist-spirit', 'raptor-herder', 'time-hopper'],
                    hand: ['change-of-heart'],
                    dicepool: ['ceremonial']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'iron-rhino']
                }
            });
        });

        it('pb damage on attack', function () {
            this.player1.play(this.changeOfHeart);
            this.player1.clickDie(0);
            this.player1.clickCard(this.brennenBlackcloud);

            expect(this.brennenBlackcloud.upgrades.length).toBe(1);

            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.clickCard(this.brennenBlackcloud);
            this.player1.clickCard(this.crystalArcher);

            this.player1.clickCard(this.hammerKnight);
            expect(this.crystalArcher.location).toBe('hand');
            expect(this.hammerKnight.damage).toBe(1);
        });
    });
});
