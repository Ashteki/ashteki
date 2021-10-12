describe('Ceremonial Dice Power', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut'],
                dicepool: ['ceremonial', 'time', 'ceremonial'],
                spellboard: ['summon-gilder'],
                discard: ['hammer-knight']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['blue-jaguar', 'iron-worker'],
                spellboard: ['summon-mist-spirit']
            }
        });
    });

    it('return ally from discard', function () {
        this.player1.clickDie(0);
        this.player1.clickPrompt('Ceremonial Dice Power');
        this.player1.clickCard(this.hammerKnight);
        expect(this.aradelSummergaard.damage).toBe(1);
        expect(this.hammerKnight.location).toBe('hand');

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('can be cancelled', function () {
        this.player1.clickDie(0);
        this.player1.clickPrompt('Ceremonial Dice Power');
        this.player1.clickPrompt('Cancel');
        expect(this.player1.actions.side).toBe(1);
        expect(this.player1.dicepool[0].exhausted).toBe(false);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
