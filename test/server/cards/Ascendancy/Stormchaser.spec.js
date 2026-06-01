describe('Stormchaser', function () {
    describe('when declared as an attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker', 'stormchaser'],
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

        it('action spell then attack with plus 2', function () {
            this.player1.play(this.searingBolt);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(2);

            this.player1.clickAttack(this.blueJaguar);
            this.player1.clickCard(this.stormchaser);
            expect(this.stormchaser.attack).toBe(3);
            this.player2.clickDone(); // guard
            this.player2.clickNo(); // counter

            expect(this.blueJaguar.location).toBe('archives');

            expect(this.player1).toHaveDefaultPrompt();
            this.player1.endTurn();
            expect(this.stormchaser.attack).toBe(1);
        });

        it('no action spell then attack with no modifier', function () {
            this.player1.clickAttack(this.blueJaguar);
            this.player1.clickCard(this.stormchaser);
            this.player2.clickDone(); // guard
            this.player2.clickNo(); // counter

            expect(this.blueJaguar.damage).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
