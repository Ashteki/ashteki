describe('Body Inversion', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['illusion'],
                spellboard: ['body-inversion']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['anchornaut', 'crimson-bomber']
            }
        });
    });

    it('flips attack and life', function () {
        this.player1.clickCard(this.bodyInversion);
        this.player1.clickPrompt('Body Inversion a unit');
        this.player1.clickCard(this.crimsonBomber);

        expect(this.crimsonBomber.attack).toBe(2);
        expect(this.crimsonBomber.life).toBe(3);
    });

    it('kills unit with 0 attack', function () {
        this.player1.clickCard(this.bodyInversion);
        this.player1.clickPrompt('Body Inversion a unit');
        this.player1.clickCard(this.anchornaut);

        expect(this.anchornaut.location).toBe('discard');
    });
});
