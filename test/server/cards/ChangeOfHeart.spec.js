describe('ChangeOfHeart', function () {
    describe('attached to pb', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['crystal-archer', 'mist-spirit', 'raptor-herder', 'time-hopper'],
                    hand: ['change-of-heart'],
                    dicepool: ['ceremonial', 'ceremonial']
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
            expect(this.brennenBlackcloud.upgrades.length).toBe(1);

            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.clickCard(this.brennenBlackcloud);
            expect(this.player1).not.toHavePromptButton('Spirit Burn');

            this.player1.clickCard(this.changeOfHeart);
            this.player1.clickPrompt('Change of heart');
            this.player1.clickCard(this.crystalArcher);
            this.player1.clickCard(this.ironRhino);
            expect(this.crystalArcher.location).toBe('hand');
            expect(this.ironRhino.damage).toBe(1);
        });
    });
});
