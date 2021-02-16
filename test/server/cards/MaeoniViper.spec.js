describe('Maeoni Viper command strike', function () {
    describe('Maeoni Viper command strike', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['silver-snake'],
                    hand: ['mist-typhoon'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blood-archer', 'mist-spirit', 'mist-spirit', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });

            this.silverSnake.tokens.status = 3;
            this.game.checkGameState(true);
        });

        it('happy path', function () {
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

    describe('no units in play (mine)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: [],
                    hand: ['mist-typhoon'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blood-archer', 'mist-spirit', 'mist-spirit', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });

            this.game.checkGameState(true);
        });

        it('should not be available', function () {
            expect(this.player1).not.toBeAbleToSelect(this.maeoniViper);
            this.player1.clickCard(this.maeoniViper);
            expect(this.player1).not.toHavePromptButton('Command Strike');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('no opponent units', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['silver-snake'],
                    hand: ['mist-typhoon'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });

            this.silverSnake.tokens.status = 3;
            this.game.checkGameState(true);
        });

        it('should not be available', function () {
            expect(this.player1).not.toBeAbleToSelect(this.maeoniViper);
            this.player1.clickCard(this.maeoniViper);
            expect(this.player1).not.toHavePromptButton('Command Strike');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
