describe('unseen', function () {
    describe('does not stop blocking when the only unit attacking is unseen', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'mind-fog-owl'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight', 'gilder']
                }
            });
        });

        it('single pb attacker', function () {
            this.player1.clickAttack(this.coalRoarkwin);
            this.player1.clickCard(this.mindFogOwl);
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');

            this.player2.clickCard(this.anchornaut);
            expect(this.player2).toBeAbleToSelect(this.mindFogOwl);

            this.player2.clickCard(this.mindFogOwl);
            expect(
                this.game.attackState.battles.some((b) => b.attacker === this.mindFogOwl && b.guard)
            ).toBe(true);
            this.player2.clickDone();

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('unit attack', function () {
            this.player1.clickAttack(this.anchornaut);
            this.player1.clickCard(this.mindFogOwl);

            expect(this.player2).toHavePrompt('Choose a guard?');

            expect(this.player2).toBeAbleToSelect(this.gilder);
            this.player2.clickCard(this.gilder);

            expect(
                this.game.attackState.battles.some((b) => b.attacker === this.mindFogOwl && b.guard)
            ).toBe(true);

            this.player2.clickDone(); // gilder

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('must block non-unseen defenders first', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'mind-fog-owl'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight']
                }
            });
        });

        it('must block others first', function () {
            this.player1.clickAttack(this.coalRoarkwin);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.mindFogOwl);
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');

            this.player2.clickCard(this.anchornaut);
            expect(this.player2).not.toBeAbleToSelect(this.mindFogOwl);
            expect(this.player2).toBeAbleToSelect(this.ironWorker);

            this.player2.clickCard(this.mindFogOwl);
            expect(
                this.game.attackState.battles.some((b) => b.attacker === this.mindFogOwl && b.guard)
            ).toBe(false);

            this.player2.clickCard(this.ironWorker);

            this.player2.clickCard(this.hammerKnight);
            // now you can block the owl
            expect(this.player2).toBeAbleToSelect(this.mindFogOwl);
            this.player2.clickCard(this.mindFogOwl);

            this.player1.clickCard(this.mindFogOwl);
            this.player1.clickCard(this.ironWorker);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
