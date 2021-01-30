describe('Silver Snake', function () {
    describe('Consume', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['silver-snake'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['blood-archer'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });

            this.silverSnake.tokens.status = 3;
            this.game.checkGameState(true);
        });

        it('should trigger on blood archer destroy', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.bloodArcher);
            this.player1.clickCard(this.silverSnake);

            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('No');

            expect(this.silverSnake.status).toBe(4);
        });

        it('maeoni command strike', function () {
            this.player1.clickCard(this.maeoniViper);
            this.player1.clickPrompt('Command Strike');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.silverSnake);
            this.player1.clickCard(this.bloodArcher);
            expect(this.silverSnake.status).toBe(4);
        });
    });
});
