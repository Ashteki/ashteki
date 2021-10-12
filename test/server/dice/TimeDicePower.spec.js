describe('Time Dice Power', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut'],
                dicepool: ['time', 'time', 'ceremonial'],
                spellboard: ['summon-gilder']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['blue-jaguar', 'iron-worker'],
                spellboard: ['summon-mist-spirit']
            }
        });

        this.summonMistSpirit.tokens.status = 2;
        this.ironWorker.tokens.status = 1;
    });

    it('add status to my unit then remove from their unit', function () {
        expect(this.ironWorker.status).toBe(1);
        expect(this.anchornaut.status).toBe(0);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Time Dice Power');
        expect(this.player1).toBeAbleToSelect(this.anchornaut); // other player
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker); // other player
        expect(this.player1).not.toBeAbleToSelect(this.summonGilder); // other player
        this.player1.clickCard(this.anchornaut);
        expect(this.ironWorker.status).toBe(1);

        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.status).toBe(0);

        this.player1.endTurn();
    });

    it('can be cancelled in first target', function () {
        this.player1.clickDie(0);
        this.player1.clickPrompt('Time Dice Power');
        this.player1.clickPrompt('Cancel');
        expect(this.player1.actions.side).toBe(1);
        expect(this.player1.dicepool[0].exhausted).toBe(false);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
