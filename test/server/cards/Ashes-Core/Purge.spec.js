describe('Purge unfocussed', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['charm', 'charm'],
                hand: [],
                spellboard: ['purge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('discards opponents topofdeck', function () {
        let oppDeck = this.player2.deck.length;
        this.player1.clickCard(this.purge);
        this.player1.clickPrompt('Purge');

        expect(this.player2.deck.length).toBe(oppDeck - 1);
    });
});
