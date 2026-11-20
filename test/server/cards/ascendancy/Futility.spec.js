describe('Futility alteration', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'ethias-hollowbrook',
                inPlay: ['mist-spirit', 'flute-mage'],
                dicepool: ['illusion'],
                hand: ['futility', 'massive-growth']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker']
            }
        });
    });

    it('attaches to a unit without upgrades and grants Terrifying 1 while attached', function () {
        this.player1.attachUpgrade(this.massiveGrowth, this.fluteMage);
        expect(this.fluteMage.upgrades.length).toBe(1);

        expect(this.futility.canAttach(this.fluteMage, { player: this.player1.player })).toBe(
            false
        );

        this.player1.clickCard(this.futility);
        this.player1.clickPrompt('Play this Alteration');
        this.player1.clickDie(0);
        this.player1.clickCard(this.mistSpirit);

        expect(this.mistSpirit.upgrades).toContain(this.futility);
        expect(this.mistSpirit.hasKeyword('terrifying')).toBe(true);

        this.player1.endTurn();
        expect(this.mistSpirit.hasKeyword('terrifying')).toBe(true);
    });
});
