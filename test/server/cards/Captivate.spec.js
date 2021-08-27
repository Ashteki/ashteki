describe('Captivate', function () {
    describe('Enters play destroy unit', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['anchornaut'],
                    dicepool: ['charm', 'time', 'charm', 'charm', 'time'],
                    spellboard: [],
                    hand: ['captivate']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });

            this.ironWorker.tokens.exhaustion = 1;
        });

        it('destroy exhausted unit when enters play', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('Charm Dice Power');
            expect(this.player1).toBeAbleToSelect(this.ironWorker); // other player
            this.player1.clickCard(this.ironWorker);
            expect(this.player1).toHaveDefaultPrompt();

            this.player1.play(this.captivate);
            expect(this.player1).not.toHaveDefaultPrompt();
            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);

            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.location).toBe('discard');
        });
    });

    describe('Captivate Action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['anchornaut'],
                    dicepool: ['charm', 'time', 'charm', 'charm', 'time'],
                    spellboard: ['captivate'],
                    hand: []
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('restrict attack from target unit until my next turn', function () {
            this.player1.clickCard(this.captivate);
            this.player1.clickPrompt('Captivate');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.checkRestrictions('attack')).toBe(false);

            this.player1.endTurn();
            this.player2.clickAttack(this.luluFirststone);
            expect(this.player2).toBeAbleToSelect(this.hammerKnight);
            expect(this.player2).not.toBeAbleToSelect(this.ironWorker);
            this.player2.clickDone();
            this.player2.actions.main = false;
            this.player2.endTurn();

            expect(this.ironWorker.checkRestrictions('attack')).toBe(true);
        });

        it('restrict attack from target unit until end of round', function () {
            this.player1.clickCard(this.captivate);
            this.player1.clickPrompt('Captivate');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.checkRestrictions('attack')).toBe(false);

            this.player1.endTurn();
            this.player2.endTurn();

            // dice pinning
            this.player1.clickDone();
            this.player2.clickDone();
            // card discard
            this.player1.clickDone();
            this.player2.clickDone();
            this.player2.clickPrompt('0'); // iron worker overtime

            expect(this.player2).toHaveDefaultPrompt();
            expect(this.game.activePlayer.name).toBe(this.player2.name);
            expect(this.ironWorker.checkRestrictions('attack')).toBe(true);
        });
    });
});
