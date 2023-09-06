describe('Chimera Discard', function () {
    describe('Saria hearts pull', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                allowSetup: true,
                player1: {
                    phoenixborn: 'saria-guideman',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['abundance'],
                    deck: ['anchornaut', 'iron-worker']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('deck discard effect causes damage to fatigued chimera', function () {
            const decklength = this.player2.deck.length;
            this.player2.player.applyFatigue();
            expect(this.player2.fatigued).toBe(true);

            this.player1.clickCard(this.sariaGuideman);
            this.player1.clickPrompt('Heart\'s Pull');
            this.player1.clickYes();

            expect(this.player2.deck.length).toBe(decklength - 1);
            expect(this.player2.discard.length).toBe(1);
            expect(this.virosS1.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
