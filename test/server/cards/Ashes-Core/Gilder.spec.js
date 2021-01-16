describe('Gilder', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['crimson-bomber'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                hand: ['molten-gold']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['gilder', 'iron-worker'],
                hand: ['out-of-the-mist'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
            }
        });

        this.aradelSummergaard.tokens.damage = 1;
        this.player1.dicepool[0].lower();
    });

    it('adds a status token on destroyed', function () {
        this.player1.clickCard(this.moltenGold);
        this.player1.clickPrompt('Play this action');
        this.player1.clickCard(this.gilder);

        this.player2.clickCard(this.ironWorker);

        expect(this.ironWorker.status).toBe(1);
    });

    it('adds a status token on destroyed while blocking', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.gilder);
        this.player1.clickCard(this.crimsonBomber);

        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('No');

        this.player2.clickCard(this.ironWorker);

        expect(this.ironWorker.status).toBe(1);
    });
});
