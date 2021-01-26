describe('Gilder BUG', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'saria-guideman',
                inPlay: ['frost-fang'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['gilder', 'silver-snake'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
            }
        });

        this.silverSnake.tokens.status = 3;
        this.game.checkGameState(true);
    });

    // this DIDN'T reproduce the error
    it('adds a status token if destroyed while guarding', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.silverSnake);
        this.player1.clickCard(this.frostFang);

        this.player2.clickCard(this.gilder);

        this.player2.clickCard(this.silverSnake);

        expect(this.silverSnake.status).toBe(4);
    });
});
