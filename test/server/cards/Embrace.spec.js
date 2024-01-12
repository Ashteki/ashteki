describe('Embrace', function () {
    describe('attached to pb', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['mist-spirit', 'raptor-herder', 'time-hopper'],
                    hand: ['embrace'],
                    dicepool: ['ceremonial', 'charm'],
                    discard: ['anchornaut']
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

        it('attach. prevent opponent attack damage', function () {
            this.player1.play(this.embrace);
            expect(this.maeoniViper.upgrades.length).toBe(1);

            this.player1.clickAttack(this.aradelSummergaard);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickDone();
            this.player2.clickDone(); // blockers
            expect(this.aradelSummergaard.damage).toBe(0);
            expect(this.embrace.location).toBe('discard');
        });

        it('attach, no trigger on self inflicted', function () {
            this.player1.player.actions.side = 2;

            this.player1.play(this.embrace);
            expect(this.maeoniViper.upgrades.length).toBe(1);
            this.player1.clickDie(0);
            this.player1.clickPrompt('Ceremonial Dice Power');
            this.player1.clickCard(this.anchornaut);

            expect(this.anchornaut.location).toBe('hand');
            expect(this.maeoniViper.damage).toBe(1);
            expect(this.embrace.location).toBe('play area');
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
