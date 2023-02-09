describe('Silver Snake', function () {
    describe('Consume', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['silver-snake'],
                    spellboard: ['summon-silver-snake'],
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

        it('should warn if no snake in conjuration pile', function () {
            this.player1.clickCard(this.summonSilverSnake);
            this.player1.clickPrompt('Summon Silver Snake');
            expect(this.player1).toHavePrompt('Warning');
        })

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

        it('triggers multiple times on multiple deaths', function () {
            this.player1.clickCard(this.mistTyphoon);
            this.player1.clickPrompt('Play this Action');
            this.player1.clickCard(this.bloodArcher);
            this.player1.clickCard(this.player2.inPlay[3]);
            this.player1.clickCard(this.player2.inPlay[2]);
            this.player1.clickCard(this.player2.inPlay[1]);
            expect(this.bloodArcher.location).toBe('play area');
            expect(this.silverSnake.status).toBe(6);
        });
    });

    describe('Silver snake with reflections in the water', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                    hand: ['reflections-in-the-water']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['silver-snake'],
                    hand: ['mist-typhoon'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });

            this.silverSnake.tokens.status = 3;
            this.game.checkGameState(true);
        });

        it('does not affect attack value', function () {
            expect(this.silverSnake.attack).toBe(3);
            this.player1.play(this.reflectionsInTheWater);
            this.player1.clickDie(3);
            this.player1.clickCard(this.silverSnake);

            expect(this.silverSnake.upgrades.length).toBe(1);
            expect(this.silverSnake.attack).toBe(3);
        });
    });
});
