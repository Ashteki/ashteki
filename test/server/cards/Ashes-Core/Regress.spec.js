describe('Regress', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                dicepool: ['charm', 'natural', 'ceremonial'],
                hand: ['regress']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['silver-snake', 'iron-worker'],
                dicepool: ['ceremonial', 'natural', 'natural', 'charm'],
                hand: ['molten-gold']
            }
        });

        this.silverSnake.tokens.status = 5;
    });

    it('reduces attack value, plus BUG test for command strike', function () {
        this.player1.clickCard(this.regress);
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.silverSnake);
        expect(this.silverSnake.attack).toBe(2);

        // BUG test when using command strike
        this.player1.endTurn();
        this.player2.clickCard(this.maeoniViper);
        this.player2.clickPrompt('Command Strike');
        this.player2.clickDie(0);
        this.player2.clickDie(1);
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.silverSnake);
        this.player2.clickCard(this.hammerKnight);

        expect(this.hammerKnight.damage).toBe(2);
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.player2).toHaveDefaultPrompt();
    });
});
