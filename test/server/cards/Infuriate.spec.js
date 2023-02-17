describe('Infuriate', function () {
    describe('On Attackers declared', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'james-endersight',
                    inPlay: ['iron-rhino'],
                    hand: ['infuriate'],
                    dicepool: ['ceremonial']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight']
                }
            });
        });

        it('host damage on attack and increased attack', function () {
            this.player1.play(this.infuriate);
            this.player1.clickCard(this.ironRhino);
            expect(this.ironRhino.upgrades.length).toBe(1);
            expect(this.ironRhino.damage).toBe(0);
            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.ironRhino);

            expect(this.ironRhino.damage).toBe(2);
            expect(this.ironRhino.attack).toBe(9);

        });
    });
});
