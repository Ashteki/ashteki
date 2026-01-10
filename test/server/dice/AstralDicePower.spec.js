describe('Astral Dice Power', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['gilder'],
                dicepool: ['astral', 'natural', 'ceremonial']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'iron-worker'],
                spellboard: ['summon-mist-spirit'],
                dicepool: ['natural', 'natural', 'charm']
            }
        });
    });

    it('attaches to unit, exhaust to prevent 1 damage', function () {
        const astralDie = this.player1.dicepool[0];
        expect(this.gilder.hasAstralDie).toBe(false);
        expect(this.player1.dicepool[0].exhausted).toBe(false);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Astral Dice Power');
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker); // other player
        this.player1.clickCard(this.gilder);
        expect(this.gilder.hasAstralDie).toBe(true);
        expect(this.gilder.dieUpgrades.length).toBe(1);

        this.player1.endTurn();
        this.player2.useCardAbility(this.aradelSummergaard, 'Water Blast');
        this.player2.clickCard(this.gilder);
        expect(this.gilder.damage).toBe(1); // damage prevented
        expect(this.gilder.dieUpgrades.length).toBe(0);
        expect(astralDie.exhausted).toBe(true);
        expect(this.player2).toHaveDefaultPrompt();
    });

    it('attaches to phoenixborn', function () {
        const astralDie = this.player1.dicepool[0];
        expect(this.coalRoarkwin.hasAstralDie).toBe(false);
        expect(this.player1.dicepool[0].exhausted).toBe(false);
        this.player1.clickDie(0);
        this.player1.clickPrompt('Astral Dice Power');
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker); // other player
        this.player1.clickCard(this.coalRoarkwin);
        expect(this.coalRoarkwin.hasAstralDie).toBe(true);
        expect(this.coalRoarkwin.dieUpgrades.length).toBe(1);

        this.player1.endTurn();
        this.player2.endTurn();
        this.player1.clickPrompt('Done'); // no pins
        this.player2.clickDone();
        expect(astralDie.exhausted).toBe(false); // new round
        expect(this.coalRoarkwin.dieUpgrades.length).toBe(0);
    });
});
