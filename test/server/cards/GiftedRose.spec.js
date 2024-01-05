describe('Gifted Rose', function () {
    describe('attached to pb', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['mist-spirit', 'raptor-herder', 'time-hopper'],
                    hand: ['gifted-rose'],
                    dicepool: ['ceremonial', 'charm']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'iron-rhino', 'adept-duelist'],
                    dicepool: ['ceremonial', 'charm'],
                    hand: ['choke']
                }
            });
        });

        it('attach. cannot guard. Reject with die', function () {
            this.player1.play(this.giftedRose);
            this.player1.clickDie(0);

            expect(this.aradelSummergaard.upgrades.length).toBe(1);

            this.player1.clickAttack(this.ironRhino);
            this.player1.clickCard(this.mistSpirit);

            // no guard, only counter
            this.player2.clickNo();

            expect(this.ironRhino.damage).toBe(1);
            this.player1.endTurn();

            this.player2.clickCard(this.giftedRose);
            this.player2.clickPrompt('Reject');
            this.player2.clickPrompt('Basic Die');
            this.player2.clickDie(0);
            expect(this.giftedRose.location).toBe('discard');
            expect(this.player2.dicepool[0].exhausted).toBe(true);
        });

        it('attach. cannot guard. Reject with discard', function () {
            this.player1.play(this.giftedRose);
            this.player1.clickDie(0);

            expect(this.aradelSummergaard.upgrades.length).toBe(1);

            this.player1.clickAttack(this.ironRhino);
            this.player1.clickCard(this.mistSpirit);

            // no guard, only counter
            this.player2.clickNo();

            expect(this.ironRhino.damage).toBe(1);
            this.player1.endTurn();

            this.player2.clickCard(this.giftedRose);
            this.player2.clickPrompt('Reject');
            this.player2.clickPrompt('Discard');
            this.player2.clickCard(this.choke);
            expect(this.giftedRose.location).toBe('discard');
            expect(this.choke.location).toBe('discard');
        });
    });
});
