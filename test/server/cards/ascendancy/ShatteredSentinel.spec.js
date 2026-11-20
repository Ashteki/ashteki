describe('Shattered Sentinel', function () {
    describe('when declared as an attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker', 'shattered-sentinel'],
                    dicepool: ['natural', 'natural', 'astral', 'astral'],
                    spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                    archives: [],
                    hand: ['anchornaut', 'hurricane', 'searing-bolt', 'rayward-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                    inPlay: ['beast-tamer', 'blue-jaguar', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('deal 1 damage to all opponents exhausted units', function () {
            this.beastTamer.exhaust();
            this.blueJaguar.exhaust();

            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.shatteredSentinel);

            this.player1.clickCard(this.beastTamer);
            this.player1.clickCard(this.blueJaguar);

            this.player2.clickDone(); // guard
            this.player2.clickNo(); // counter
            expect(this.hammerKnight.damage).toBe(2);
            expect(this.blueJaguar.damage).toBe(1);
            expect(this.beastTamer.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
