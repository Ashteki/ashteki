describe('Wolfpack Leader', function () {
    describe('Enters Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['wolfpack-leader', 'freezing-blast', 'clashing-tempers'],
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
            this.player1.play(this.wolfpackLeader);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();

            expect(this.wolfpackLeader.status).toBe(2);
        });
    });

    describe('Start of turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['wolfpack-leader', 'mist-spirit', 'iron-worker'],
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
            this.wolfpackLeader.tokens.status = 2;
        });

        it('offers to summon pack wolf', function () {
            expect(this.packWolf.location).toBe('archives');
            expect(this.wolfpackLeader.status).toBe(2);

            this.player1.endTurn();
            this.player2.actions.main = false;
            this.player2.endTurn();

            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickYes();
            expect(this.packWolf.location).toBe('play area');
            expect(this.wolfpackLeader.status).toBe(1);
        });

        it('no to summon pack wolf', function () {
            expect(this.packWolf.location).toBe('archives');
            expect(this.wolfpackLeader.status).toBe(2);

            this.player1.endTurn();
            this.player2.actions.main = false;
            this.player2.endTurn();

            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickNo();
            expect(this.packWolf.location).toBe('archives');
            expect(this.wolfpackLeader.status).toBe(2);
        });
    });
});
