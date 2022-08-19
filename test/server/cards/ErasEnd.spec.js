describe('Eras End', function () {
    describe('abnormal end of round event', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['crypt-guardian', 'anchornaut'],
                    dicepool: ['ceremonial', 'charm', 'charm', 'time', 'illusion'],
                    deck: ['anchornaut'],
                    hand: ['eras-end']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['chant-of-revenge'],
                    inPlay: ['river-skald']
                }
            });
        });

        it('play triggers end round event', function () {
            this.player1.play(this.erasEnd);

            // triggers Crypt guardian
            this.player1.clickCard(this.riverSkald);

            expect(this.riverSkald.exhausted).toBe(true);
        });

        it('play doesnt trigger exhausted ability', function () {
            this.cryptGuardian.tokens.exhaustion = 1;
            this.player1.play(this.erasEnd);

            expect(this.player1).toHaveDefaultPrompt();
            // triggers NOT Crypt guardian
            this.player1.clickCard(this.riverSkald);

            expect(this.riverSkald.exhausted).toBe(false);
        });
    });

    describe('ordering', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['crypt-guardian', 'anchornaut'],
                    dicepool: ['ceremonial', 'charm', 'charm', 'time', 'illusion'],
                    deck: ['anchornaut'],
                    hand: ['eras-end']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['chant-of-revenge'],
                    inPlay: ['river-skald', 'ruin-dweller']
                }
            });
        });

        it('play triggers end round event', function () {
            this.player1.play(this.erasEnd);

            this.player1.clickCard(this.cryptGuardian);
            // triggers Crypt guardian
            this.player1.clickCard(this.riverSkald);

            this.player2.clickCard(this.orrickGilstream);

            expect(this.riverSkald.exhausted).toBe(true);
            expect(this.orrickGilstream.damage).toBe(1);
        });
    });
});
