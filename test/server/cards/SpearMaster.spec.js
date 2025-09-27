describe('Spear Master', function () {
    describe('Enters Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'time', 'time', 'natural', 'natural'],
                    hand: ['spear-master', 'freezing-blast', 'clashing-tempers'],
                    archives: ['ice-buff', 'pack-wolf']
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

        it('gets 2 status', function () {
            this.player1.play(this.spearMaster);
            this.player1.clickDie(0);
            this.player1.clickDone();

            expect(this.spearMaster.location).toBe('play area');
            expect(this.spearMaster.status).toBe(2);
        });
    });

    describe('On attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['spear-master', 'mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'time', 'time', 'natural', 'natural'],
                    hand: ['freezing-blast', 'clashing-tempers'],
                    archives: ['ice-buff', 'pack-wolf']
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

        it('spear volley triggers', function () {
            this.spearMaster.tokens.status = 2;
            this.ironWorker.tokens.status = 1;
            this.hammerKnight.tokens.status = 1;
            expect(this.spearMaster.status).toBe(2);
            expect(this.ironWorker.status).toBe(1);

            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.spearMaster);
            // should open prompt
            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.status).toBe(0);
            expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);
            this.player1.clickCard(this.spearMaster);
            expect(this.spearMaster.status).toBe(1);
            this.player1.clickDone();

            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);
            expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);
            expect(this.player1).not.toBeAbleToSelect(this.spearMaster); // own unit

            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.hammerKnight.damage).toBe(1);

            expect(this.player1).toHaveWaitingPrompt(); // resolving attack action
        });

        it('spear volley reset', function () {
            this.spearMaster.tokens.status = 2;
            this.ironWorker.tokens.status = 1;

            expect(this.spearMaster.status).toBe(2);
            expect(this.ironWorker.status).toBe(1);

            this.player1.clickAttack(this.anchornaut);
            this.player1.clickCard(this.spearMaster);
            // should open prompt
            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.status).toBe(0);
            this.player1.clickCard(this.spearMaster);
            expect(this.spearMaster.status).toBe(1);

            this.player1.clickPrompt('Reset');
            expect(this.spearMaster.status).toBe(2);
            expect(this.ironWorker.status).toBe(1);
            expect(this.player1).not.toHaveDefaultPrompt();
        });

        it('no tokens means no prompt', function () {
            this.player1.clickAttack(this.anchornaut);
            this.player1.clickCard(this.spearMaster);
            // should not open prompt
            expect(this.player1).toHaveWaitingPrompt();
        });

        it('no token chosen means no prompt', function () {
            this.spearMaster.tokens.status = 2;
            this.ironWorker.tokens.status = 1;

            this.player1.clickAttack(this.anchornaut);
            this.player1.clickCard(this.spearMaster);
            // should open prompt
            this.player1.clickDone();

            expect(this.player1).toHaveWaitingPrompt();
        });
    });

    describe('On attack fewer targets than tokens', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['spear-master', 'mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'time', 'time', 'natural', 'natural'],
                    hand: ['freezing-blast', 'clashing-tempers'],
                    archives: ['ice-buff', 'pack-wolf']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: [],
                    dicepool: ['natural', 'natural', 'charm']
                }
            });
        });

        it('spear volley triggers', function () {
            this.spearMaster.tokens.status = 2;
            this.ironWorker.tokens.status = 1;
            expect(this.spearMaster.status).toBe(2);
            expect(this.ironWorker.status).toBe(1);

            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.spearMaster);
            // should open prompt
            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.status).toBe(0);
            this.player1.clickCard(this.spearMaster);
            expect(this.spearMaster.status).toBe(1);
            this.player1.clickDone();

            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);
            expect(this.player1).not.toBeAbleToSelect(this.hammerKnight);

            // no other targets, so should complete

            expect(this.player1).toHaveWaitingPrompt(); // resolving attack action
        });
    });

    describe('end of round replenish', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['spear-master', 'mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['freezing-blast', 'clashing-tempers'],
                    archives: ['ice-buff', 'pack-wolf']
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

        it('adds status tokens', function () {
            expect(this.spearMaster.status).toBe(0);

            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone(); // keep dice?
            this.player2.clickDone();
            // end round
            expect(this.spearMaster.status).toBe(2);
        });
    });
});
