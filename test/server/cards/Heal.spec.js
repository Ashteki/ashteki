describe('Heal', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['hammer-knight'],
                dicepool: ['divine', 'charm'],
                hand: ['heal'],
                spellboard: ['chant-of-revenge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['silver-snake', 'mist-spirit'],
                spellboard: []
            }
        });

        this.hammerKnight.tokens.damage = 1;
        this.silverSnake.tokens.damage = 3;
        this.odetteDiamondcrest.tokens.damage = 11;
        this.aradelSummergaard.tokens.damage = 1;
    });

    it('heals all unit damage', function () {
        this.player1.clickCard(this.heal);
        this.player1.clickPrompt('Play this action');

        this.player1.clickCard(this.silverSnake);
        expect(this.hammerKnight.damage).toBe(1);
        expect(this.silverSnake.damage).toBe(0);
        expect(this.odetteDiamondcrest.damage).toBe(11);
        expect(this.aradelSummergaard.damage).toBe(1);
    });

    it('heals 2 from pb', function () {
        this.player1.clickCard(this.heal);
        this.player1.clickPrompt('Play this action');

        this.player1.clickCard(this.odetteDiamondcrest);
        expect(this.odetteDiamondcrest.damage).toBe(9);
    });
});
