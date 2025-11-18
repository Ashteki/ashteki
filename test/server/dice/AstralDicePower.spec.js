describe('Astral Dice Power', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['anchornaut'],
                dicepool: ['astral', 'natural', 'ceremonial']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['blue-jaguar', 'iron-worker'],
                spellboard: ['summon-mist-spirit']
            }
        });
    });

    it('attaches to unit', function () {
        expect(this.anchornaut.hasAstralDie).toBe(false);
        expect(this.player1.dicepool[0].exhausted).toBe(false);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Astral Dice Power');
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker); // other player
        this.player1.clickCard(this.anchornaut);
        expect(this.anchornaut.hasAstralDie).toBe(true);
        expect(this.anchornaut.dieUpgrades.length).toBe(1);

        this.player1.endTurn();
        this.player2.endTurn();
        this.player1.clickPrompt('Done'); // no pins
        expect(this.anchornaut.dieUpgrades.length).toBe(0);
    });

    it('attaches to phoenixborn', function () {
        expect(this.anchornaut.hasAstralDie).toBe(false);
        expect(this.player1.dicepool[0].exhausted).toBe(false);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Astral Dice Power');
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker); // other player
        this.player1.clickCard(this.aradelSummergaard);
        expect(this.aradelSummergaard.hasAstralDie).toBe(true);
        expect(this.aradelSummergaard.dieUpgrades.length).toBe(1);

        this.player1.endTurn();
        this.player2.endTurn();
        this.player1.clickPrompt('Done'); // no pins
        expect(this.aradelSummergaard.dieUpgrades.length).toBe(0);
    });
});
