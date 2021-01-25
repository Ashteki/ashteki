describe('Choke', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['mist-spirit', 'iron-worker'],
                dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                hand: ['choke']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                dicepool: ['natural', 'natural']
            }
        });
    });

    it('exhaust and damage phoenixborn', function () {
        expect(this.rinNorthfell.damage).toBe(0);
        expect(this.rinNorthfell.exhausted).toBe(false);

        this.player1.clickCard(this.choke);
        this.player1.clickPrompt('Play this action');
        expect(this.player1).toBeAbleToSelect(this.rinNorthfell);
        this.player1.clickCard(this.rinNorthfell);

        expect(this.rinNorthfell.exhausted).toBe(true);
        expect(this.rinNorthfell.damage).toBe(1);
    });

    it('can not use if opponent pb is exhausted', function () {
        this.rinNorthfell.tokens.exhaustion = 1;
        expect(this.rinNorthfell.exhausted).toBe(true);

        this.player1.clickCard(this.choke);
        this.player1.clickPrompt('Play this action');

        expect(this.player1).not.toBeAbleToSelect(this.rinNorthfell);

        // will drop out because rin can't be targetted
        expect(this.player1).toHaveDefaultPrompt();
    });
});
