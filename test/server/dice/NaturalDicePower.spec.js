describe('Natural Dice Power', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut'],
                dicepool: ['natural', 'time', 'ceremonial'],
                spellboard: ['summon-gilder']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['blue-jaguar', 'iron-worker'],
                spellboard: ['summon-mist-spirit']
            }
        });
    });

    it('deal 1 damage to target unit', function () {
        this.player1.clickDie(0);
        this.player1.clickPrompt('Natural Dice Power');
        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.damage).toBe(1);
        expect(this.player1.dicepool[0].exhausted).toBe(true);

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('can be cancelled', function () {
        this.player1.clickDie(0);
        this.player1.clickPrompt('Natural Dice Power');
        this.player1.clickPrompt('Cancel');
        expect(this.player1.actions.side).toBe(1);
        expect(this.player1.dicepool[0].exhausted).toBe(false);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
