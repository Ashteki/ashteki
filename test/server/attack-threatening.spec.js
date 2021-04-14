describe('threatening', function () {
    describe('normal defenders', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['grave-knight'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker']
                }
            });
        });

        it('must be blocked during PB attack', function () {
            this.player1.clickAttack(this.coalRoarkwin);
            this.player1.clickCard(this.graveKnight);
            this.player1.clickDone();

            // try to click to not block
            this.player2.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');

            this.player2.clickCard(this.anchornaut);
            this.player2.clickCard(this.graveKnight);

            this.player2.clickDone();

            expect(this.player2).not.toHavePrompt('Choose a blocker');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('no effect during unit attack', function () {
            this.player1.clickAttack(this.anchornaut);
            this.player1.clickCard(this.graveKnight);

            expect(this.player2).toHavePrompt('Choose a guard?');
            this.player2.clickDone();
            expect(this.player2).toHavePrompt('Do you want to counter?');
            this.player2.clickNo();

            expect(this.anchornaut.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('cannot block defender', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['grave-knight'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['salamander-monk-spirit']
                }
            });
        });

        it('cannot be blocked', function () {
            this.player1.clickAttack(this.coalRoarkwin);
            this.player1.clickCard(this.graveKnight);
            this.player1.clickDone();

            expect(this.coalRoarkwin.damage).toBe(4);
        });
    });

    describe('cannot block not chosen', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['grave-knight'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['salamander-monk-spirit', 'anchornaut']
                }
            });
        });

        it('must rechoose', function () {
            this.player1.clickAttack(this.coalRoarkwin);
            this.player1.clickCard(this.graveKnight);
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');

            this.player2.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');
            this.player2.clickCard(this.anchornaut);
            this.player2.clickCard(this.graveKnight);

            expect(this.anchornaut.location).toBe('discard');
            // overkill 1
            expect(this.coalRoarkwin.damage).toBe(1);
        });
    });

    describe('cannot block both threats', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['grave-knight', 'grave-knight'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['salamander-monk-spirit', 'anchornaut']
                }
            });
        });

        it('must rechoose', function () {
            this.player1.clickAttack(this.coalRoarkwin);
            this.player1.clickCard(this.player1.inPlay[0]);
            this.player1.clickCard(this.player1.inPlay[1]);
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');

            this.player2.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');
            this.player2.clickCard(this.anchornaut);
            this.player2.clickCard(this.player1.inPlay[1]);

            this.player1.clickCard(this.player1.inPlay[1]);

            expect(this.anchornaut.location).toBe('discard');
            // overkill 1 + 4 unblocked
            expect(this.coalRoarkwin.damage).toBe(5);
        });
    });
});
