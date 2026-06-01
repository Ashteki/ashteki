describe('Galewind Hawk', function () {
    describe('when declared as an attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker', 'galewind-hawk'],
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
            this.player1.dicepool[0].exhaust();
            this.player1.dicepool[2].exhaust();
        });

        it('resolve natural die', function () {
            this.player1.clickAttack(this.blueJaguar);
            this.player1.clickCard(this.galewindHawk);

            // reaction
            this.player1.clickCard(this.galewindHawk);
            this.player1.clickDie(0);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);

            expect(this.player1).toHaveWaitingPrompt(); // opp guard choice
        });

        it('resolve astral die', function () {
            this.player1.clickAttack(this.blueJaguar);
            this.player1.clickCard(this.galewindHawk);

            // reaction
            this.player1.clickCard(this.galewindHawk);
            this.player1.clickDie(2);
            this.player1.clickCard(this.kannaGaleheart);
            expect(this.kannaGaleheart.isAirborne).toBe(true);

            expect(this.player1).toHaveWaitingPrompt(); // opp guard choice
        });
    });
});
