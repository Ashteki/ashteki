describe('Stamina Burst', function () {
    describe('From hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['mist-spirit', 'iron-worker'],
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

            this.luluFirststone.tokens.damage = 2;
        });

        it('heals pb for 1, attaches a spark', function () {
            expect(this.luluFirststone.damage).toBe(2);

            this.player1.play(this.staminaBurst);
            this.player1.clickDie(0);
            expect(this.luluFirststone.damage).toBe(1);

            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.upgrades.length).toBe(1);
        });
    });
});
