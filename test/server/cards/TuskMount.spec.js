describe('Tusk Mount', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['tusk-mount'],
                dicepool: ['natural'],
                archives: ['rubble-spirit', 'rubble-spirit', 'rubble-spirit']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['mist-spirit', 'living-doll'],
                deck: ['purge', 'summon-gilder', 'summon-gilder', 'stasis', 'stasis', 'iron-worker']
            }
        });
    });

    it('Summons 2 Rubble Spirits after destroying a unit, mill 2 (1 each spirit)', function () {
        expect(this.player2.deck.length).toBe(6);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.tuskMount);

        this.player2.clickPrompt('Done'); // no blocker
        this.player2.clickPrompt('No'); // no counter

        expect(this.player1).toHaveDefaultPrompt();

        expect(this.player1.archives.length).toBe(1);
        expect(this.player1.inPlay.length).toBe(3);
        expect(this.player2.deck.length).toBe(4);
    });
});
