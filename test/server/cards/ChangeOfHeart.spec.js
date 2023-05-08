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
                    inPlay: ['hammer-knight', 'iron-rhino', 'adept-duelist']
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
            expect(this.changeOfHeart.exhausted).toBe(true);

            this.player1.endTurn();
            this.player1.clickDone(); // no dice pins
            expect(this.game.round).toBe(2);
            expect(this.changeOfHeart.exhausted).toBe(false);
        });

        it('adept duelist cannot detach', function () {
            this.player1.play(this.changeOfHeart);
            this.player1.clickDie(0);
            expect(this.brennenBlackcloud.upgrades.length).toBe(1);

            this.player1.endTurn();
            this.player2.clickAttack(this.brennenBlackcloud);
            this.player2.clickCard(this.adeptDuelist);
            this.player2.clickDone();
            // reaction to onAttackersDeclared
            this.player2.clickCard(this.adeptDuelist);
            expect(this.changeOfHeart.location).toBe('play area');
            this.player2.clickCard(this.changeOfHeart);

            // no effect
            expect(this.changeOfHeart.location).toBe('play area');
            expect(this.brennenBlackcloud.upgrades.length).toBe(1);

        });
    });
});
