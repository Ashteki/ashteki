describe('Charm Dice Power', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut'],
                dicepool: ['charm', 'natural', 'ceremonial']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['blue-jaguar', 'iron-worker'],
                spellboard: ['summon-mist-spirit']
            }
        });
    });

    it('attaches to unit to reduce attack', function () {
        expect(this.ironWorker.attack).toBe(2);
        expect(this.player1.dicepool[0].exhausted).toBe(false);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Charm Dice Power');
        expect(this.player1).toBeAbleToSelect(this.ironWorker); // other player
        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.attack).toBe(1);
        expect(this.ironWorker.dieUpgrades.length).toBe(1);

        this.player1.endTurn();
        this.player2.endTurn();
        this.player1.clickPrompt('Done'); // no pins
        expect(this.ironWorker.dieUpgrades.length).toBe(0);
    });

    it('returns exhausted to dice pool on unit destroy', function () {
        let die = this.player1.dicepool[0];
        expect(die.exhausted).toBe(false);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Charm Dice Power');
        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.attack).toBe(1);

        this.player1.actions.side = 1; // bodge it
        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickPrompt('Water Blast');
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.location).toBe('discard');
        expect(this.ironWorker.dieUpgrades.length).toBe(0);
        expect(die.exhausted).toBe(true);
    });
});
