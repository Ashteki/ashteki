describe('Floral Tyrant', function () {
    describe('when declared as an attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker', 'floral-tyrant'],
                    dicepool: ['artifice', 'natural', 'astral', 'astral'],
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

        it('when charged deals ping damage equal to attack', function () {
            this.player1.useDie(0);
            this.player1.clickCard(this.floralTyrant);
            expect(this.floralTyrant.isCharged).toBe(true);

            this.player1.clickAttack(this.blueJaguar);
            this.player1.clickCard(this.floralTyrant);
            // ravaging vines target
            expect(this.player1).not.toBeAbleToSelect(this.aradelSummergaard);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(3);

            expect(this.player1).toHaveWaitingPrompt(); // opp guard choice
        });

        it('when not charged deals no ping damage', function () {
            expect(this.floralTyrant.isCharged).toBe(false);

            this.player1.clickAttack(this.blueJaguar);
            this.player1.clickCard(this.floralTyrant);
            // ravaging vines target
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(0);

            expect(this.player1).toHaveWaitingPrompt(); // opp guard choice
        });
    });
});
