describe('Divine Dice Power', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut'],
                dicepool: ['divine', 'natural', 'ceremonial']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['blue-jaguar', 'iron-worker'],
                spellboard: ['summon-mist-spirit']
            }
        });
    });

    it('attaches to unit to increase attack', function () {
        expect(this.ironWorker.attack).toBe(2);
        expect(this.player1.dicepool[0].exhausted).toBe(false);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Divine Dice Power');
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker); // other player
        this.player1.clickCard(this.anchornaut);
        expect(this.anchornaut.attack).toBe(1);
        expect(this.anchornaut.dieUpgrades.length).toBe(1);

        this.player1.endTurn();
        this.player2.endTurn();
        this.player1.clickPrompt('Done'); // no pins
        expect(this.anchornaut.dieUpgrades.length).toBe(0);
    });

    it('returns exhausted to dice pool on unit destroy', function () {
        let die = this.player1.dicepool[0];
        expect(die.exhausted).toBe(false);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Divine Dice Power');
        this.player1.clickCard(this.anchornaut);
        expect(this.anchornaut.attack).toBe(1);

        this.player1.actions.side = 1; // bodge it
        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickPrompt('Water Blast');
        this.player1.clickCard(this.anchornaut);

        expect(this.anchornaut.location).toBe('discard');
        expect(this.anchornaut.dieUpgrades.length).toBe(0);
        expect(die.exhausted).toBe(true);
    });

    it('can be cancelled', function () {
        this.player1.clickDie(0);
        this.player1.clickPrompt('Divine Dice Power');
        this.player1.clickPrompt('Cancel');
        expect(this.player1.actions.side).toBe(1);
        expect(this.player1.dicepool[0].exhausted).toBe(false);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
