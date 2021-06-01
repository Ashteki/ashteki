describe('Summon Silver Snake', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-silver-snake'],
                    dicepool: ['charm', 'charm', 'natural', 'natural'],
                    archives: ['silver-snake']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a snake', function () {
            this.player1.clickCard(this.summonSilverSnake);
            this.player1.clickPrompt('Summon Silver Snake');

            expect(this.silverSnake.location).toBe('play area');
        });
    });

    describe('Focus 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-silver-snake', 'summon-silver-snake'],
                    dicepool: ['charm', 'charm', 'natural', 'natural'],
                    archives: ['silver-snake']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['charm', 'charm', 'natural', 'natural', 'natural', 'natural']
                }
            });
        });

        it('should place a swallow and add a status token', function () {
            this.player1.clickCard(this.summonSilverSnake);
            this.player1.clickPrompt('Summon Silver Snake');
            expect(this.silverSnake.status).toBe(1);
        });
    });
});
