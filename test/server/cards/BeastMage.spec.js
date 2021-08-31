describe('Beast Mage', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'rin-northfell',
                inPlay: ['mist-spirit'],
                dicepool: ['natural', 'natural', 'natural', 'charm'],
                spellboard: [],
                hand: ['massive-growth']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['beast-mage']
            }
        });
    });

    it('modifies stats when not first player', function () {
        expect(this.player1.player.firstPlayer).toBe(true);
        expect(this.player2.player.firstPlayer).toBe(false);

        expect(this.beastMage.attack).toBe(4);
        expect(this.beastMage.life).toBe(4);
        expect(this.beastMage.recover).toBe(2);

        this.player1.endTurn();
        this.player2.endTurn();

        // dice
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.clickNo();
        this.player2.clickNo();

        expect(this.player2.player.firstPlayer).toBe(true);
        expect(this.beastMage.attack).toBe(2);
        expect(this.beastMage.life).toBe(2);
        expect(this.beastMage.recover).toBe(0);

        this.player2.endTurn();
        this.player1.endTurn();

        // dice
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.clickNo();
        this.player2.clickNo();

        expect(this.beastMage.attack).toBe(4);
        expect(this.beastMage.life).toBe(4);
        expect(this.beastMage.recover).toBe(2);
    });
});
