describe('Stamina Burst', function () {
    describe('From hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['mist-spirit'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['stamina-burst'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'holy-knight', 'anchornaut'],
                    spellboard: [],
                    hand: [],
                    dicepool: ['natural', 'natural', 'charm']
                }
            });
        });

        it('heals pb for 1, attaches a spark, then give first player token to opponent', function () {
            this.luluFirststone.tokens.damage = 2;
            expect(this.luluFirststone.damage).toBe(2);
            expect(this.player1.player.firstPlayer).toBe(true);

            this.player1.play(this.staminaBurst);
            this.player1.clickDie(0);
            expect(this.luluFirststone.damage).toBe(1);

            this.player1.clickCard(this.mistSpirit);
            expect(this.mistSpirit.upgrades.length).toBe(1);

            this.player1.clickYes();
            this.player1.clickPrompt('opponent');
            expect(this.player1.player.firstPlayer).toBe(false);
            expect(this.player2.player.firstPlayer).toBe(true);

            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone(); // pin dice
            this.player2.clickDone();
            // first player should have first turn
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player1.player.firstPlayer).toBe(true);
            expect(this.player2.player.firstPlayer).toBe(false);
        });

        it('no pb wounds still attaches a spark, then give first player token to opponent', function () {
            expect(this.luluFirststone.damage).toBe(0);
            expect(this.player1.player.firstPlayer).toBe(true);

            this.player1.play(this.staminaBurst);
            this.player1.clickDie(0);
            expect(this.luluFirststone.damage).toBe(0);

            this.player1.clickCard(this.mistSpirit);
            expect(this.mistSpirit.upgrades.length).toBe(1);

            this.player1.clickYes();
            this.player1.clickPrompt('opponent');
            expect(this.player1.player.firstPlayer).toBe(false);
            expect(this.player2.player.firstPlayer).toBe(true);

            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone(); // pin dice
            this.player2.clickDone();
            // first player should have first turn
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player1.player.firstPlayer).toBe(true);
            expect(this.player2.player.firstPlayer).toBe(false);
        });

    });
});
