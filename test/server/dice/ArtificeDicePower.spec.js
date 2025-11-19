describe('Artifice Dice Power', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut'],
                dicepool: ['artifice', 'natural', 'ceremonial']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['blue-jaguar', 'iron-worker'],
                spellboard: ['summon-mist-spirit']
            }
        });
    });

    it('attaches to unit becomes charged', function () {
        expect(this.anchornaut.isCharged).toBe(false);
        expect(this.player1.dicepool[0].exhausted).toBe(false);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Artifice Dice Power');
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker); // other player
        this.player1.clickCard(this.anchornaut);
        expect(this.anchornaut.isCharged).toBe(true);
        expect(this.anchornaut.dieUpgrades.length).toBe(1);

        this.player1.endTurn();
        expect(this.anchornaut.dieUpgrades.length).toBe(1);
        this.player2.endTurn();
        expect(this.anchornaut.dieUpgrades.length).toBe(1);
        this.player1.clickPrompt('Done'); // no pins
        expect(this.anchornaut.dieUpgrades.length).toBe(0);
        expect(this.anchornaut.isCharged).toBe(false);
        expect(this.anchornaut.location).toBe('play area');
    });
});
