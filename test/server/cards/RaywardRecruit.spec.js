describe('Rayward Recruit ', function () {
    describe('Enters play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit', 'anchornaut'],
                    dicepool: ['divine', 'charm'],
                    hand: ['rayward-recruit'],
                    discard: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('Armed allows divine die buff to self', function () {
            this.player1.clickCard(this.raywardRecruit);
            this.player1.clickPrompt('Play this Ally');
            expect(this.raywardRecruit.location).toBe('play area');
            expect(this.player1).not.toBeAbleToSelectDie(this.player1.dicepool[1]);

            this.player1.clickDie(0);
            this.player1.clickCard(this.raywardRecruit);
            expect(this.raywardRecruit.attack).toBe(1);
        });

        it('Armed allows divine die buff to own ally', function () {
            this.player1.clickCard(this.raywardRecruit);
            this.player1.clickPrompt('Play this Ally');
            expect(this.raywardRecruit.location).toBe('play area');
            expect(this.player1).not.toBeAbleToSelectDie(this.player1.dicepool[1]);

            this.player1.clickDie(0);
            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.attack).toBe(1);
        });
    });
});
