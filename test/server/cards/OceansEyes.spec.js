describe("Ocean's Eyes In Play", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['oceans-eyes', 'oceans-eyes', 'oceans-eyes'],
                spellboard: ['summon-oceans-eyes'],
                hand: ['power-through'],
                dicepool: ['time', 'natural', 'natural', 'time']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight']
            }
        });
    });

    it('on attack deal 1 damage to a wounded unit', function () {
        this.hammerKnight.tokens.damage = 1;
        this.player1.clickAttack(this.fluteMage);
        this.player1.clickCard(this.player1.inPlay[0]);
        this.player1.clickCard(this.hammerKnight);
        expect(this.hammerKnight.damage).toBe(2);
        this.player2.clickDone();
        this.player2.clickNo();
        expect(this.fluteMage.damage).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
