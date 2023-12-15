describe('Embrace', function () {
    describe('attached to pb', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['mist-spirit', 'raptor-herder', 'time-hopper'],
                    hand: ['embrace'],
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

        it('attach. prevent attack damage', function () {
            this.player1.play(this.embrace);
            expect(this.maeoniViper.upgrades.length).toBe(1);

            this.player1.endTurn();
            this.player2.clickAttack(this.maeoniViper);
            this.player2.clickCard(this.ironRhino);
            this.player2.clickDone();
            expect(this.maeoniViper.damage).toBe(0);
            expect(this.embrace.location).toBe('discard');
        });

        it('attach. prevent action spell damage', function () {
            this.player1.play(this.embrace);
            expect(this.maeoniViper.upgrades.length).toBe(1);

            this.player1.endTurn();
            this.player2.play(this.choke);
            expect(this.maeoniViper.exhausted).toBe(true);
            expect(this.maeoniViper.damage).toBe(0);
            expect(this.embrace.location).toBe('discard');
            expect(this.player2).toHaveDefaultPrompt();
        });
    });
});
