describe('Crypt Guardian', function () {
    describe('end of round', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['crypt-guardian', 'anchornaut'],
                    dicepool: ['ceremonial', 'charm', 'charm', 'time', 'illusion'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['chant-of-revenge'],
                    inPlay: ['river-skald']
                }
            });
        });

        it('Shackle 1 - end of round places exhaustion', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone();

            this.player1.clickCard(this.riverSkald);

            expect(this.riverSkald.exhausted).toBe(true);
        });
    });

    describe('when destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['crypt-guardian', 'anchornaut'],
                    dicepool: ['ceremonial', 'charm', 'charm', 'time', 'illusion'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['chant-of-revenge'],
                    inPlay: ['river-skald', 'fire-archer'],
                    dicepool: ['natural', 'natural'],
                    hand: ['molten-gold']
                }
            });
        });

        it('Shackle 1 - destroyed by molten gold (spell) places exhaustion', function () {
            this.cryptGuardian.tokens.damage = 2;
            this.player1.endTurn();

            this.player2.play(this.moltenGold);
            this.player2.clickCard(this.cryptGuardian);

            this.player1.clickCard(this.riverSkald);
            expect(this.cryptGuardian.location).toBe('discard');
            expect(this.riverSkald.exhausted).toBe(true);
        });

        it('Shackle 1 - destroyed by water blast (ability) places exhaustion', function () {
            this.cryptGuardian.tokens.damage = 2;
            this.player1.endTurn();

            this.player2.clickCard(this.aradelSummergaard);
            this.player2.clickPrompt('Water Blast');
            this.player2.clickCard(this.cryptGuardian);

            this.player1.clickCard(this.riverSkald);
            expect(this.cryptGuardian.location).toBe('discard');
            expect(this.riverSkald.exhausted).toBe(true);
        });

        it('Shackle 1 - destroyed by natural (dice power) places exhaustion', function () {
            this.cryptGuardian.tokens.damage = 3;
            this.player1.endTurn();

            this.player2.clickDie(0);
            this.player2.clickPrompt('Natural Dice Power');
            this.player2.clickCard(this.cryptGuardian);

            this.player1.clickCard(this.riverSkald);
            expect(this.cryptGuardian.location).toBe('discard');
            expect(this.riverSkald.exhausted).toBe(true);
        });

        it('Shackle 1 - destroyed by attack does not trigger', function () {
            this.cryptGuardian.tokens.damage = 3;
            this.player1.endTurn();

            this.player2.clickAttack(this.cryptGuardian);
            this.player2.clickCard(this.fireArcher);
            this.player1.clickDone();
            this.player1.clickNo();

            this.player1.clickCard(this.riverSkald);
            expect(this.cryptGuardian.location).toBe('discard');
            expect(this.riverSkald.exhausted).toBe(false);
            expect(this.player2).toHaveDefaultPrompt();
        });
    });

});
