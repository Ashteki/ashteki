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
            this.player2.clickDone();

            this.player1.clickCard(this.mindFogOwl);
            this.player1.clickCard(this.ironWorker);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it("doesn't let a player change blockers to work around unseen", function () {
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

            this.player2.clickCard(this.anchornaut);
            // you should not be able to reassign the anchornaut to block the owl
            expect(this.player2).not.toBeAbleToSelect(this.mindFogOwl);
            this.player2.clickCard(this.mindFogOwl);
            expect(
                this.game.attackState.battles.some((b) => b.attacker === this.mindFogOwl && b.guard)
            ).toBe(false);
        });
    });

    describe('must interact with terrifying', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frostback-bear', 'mind-fog-owl'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'sunshield-sentry']
                }
            });
        });

        it('by blocking non-unseen first', function () {
            this.player1.clickAttack(this.coalRoarkwin);
            this.player1.clickCard(this.frostbackBear);
            this.player1.clickCard(this.mindFogOwl);
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');

            this.player2.clickCard(this.anchornaut);
            expect(this.player2).not.toBeAbleToSelect(this.mindFogOwl);
            expect(this.player2).not.toBeAbleToSelect(this.frostbackBear);

            // try to block MFO with anchornaut
            this.player2.clickCard(this.mindFogOwl);
            expect(
                this.game.attackState.battles.some((b) => b.attacker === this.mindFogOwl && b.guard)
            ).toBe(false);

            // block FBB first with IW
            this.player2.clickCard(this.ironWorker);
            this.player2.clickCard(this.frostbackBear);
            expect(
                this.game.attackState.battles.some(
                    (b) => b.attacker === this.frostbackBear && b.guard
                )
            ).toBe(true);

            // now you can block the owl
            this.player2.clickCard(this.sunshieldSentry);
            expect(this.player2).toBeAbleToSelect(this.mindFogOwl);
            this.player2.clickCard(this.mindFogOwl);
            this.player2.clickDone();

            this.player1.clickCard(this.mindFogOwl);
            this.player1.clickCard(this.frostbackBear);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('and charm power die is considered for terrifying', function () {
            this.player1.clickDie(2);
            this.player1.clickPrompt('Charm Dice Power');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.attack).toBe(1);
            this.player1.clickAttack(this.coalRoarkwin);
            this.player1.clickCard(this.frostbackBear);
            this.player1.clickCard(this.mindFogOwl);
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');

            this.player2.clickCard(this.anchornaut);
            expect(this.player2).not.toBeAbleToSelect(this.mindFogOwl);
            expect(this.player2).not.toBeAbleToSelect(this.frostbackBear);

            this.player2.clickCard(this.frostbackBear);
            expect(
                this.game.attackState.battles.some((b) => b.attacker === this.frostbackBear && b.guard)
            ).toBe(false);

            this.player2.clickCard(this.anchornaut);

            this.player2.clickCard(this.mindFogOwl);
            expect(
                this.game.attackState.battles.some((b) => b.attacker === this.mindFogOwl && b.guard)
            ).toBe(false);

            this.player2.clickCard(this.ironWorker);

            // Charm power die means you can't block either attacker
            expect(this.player2).not.toBeAbleToSelect(this.mindFogOwl);
            expect(this.player2).not.toBeAbleToSelect(this.frostbackBear);
        });
    });
});
