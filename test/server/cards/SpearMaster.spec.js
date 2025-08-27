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

        it('offers to summon pack wolf', function () {
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
