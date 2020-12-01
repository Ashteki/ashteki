describe('Abundance when focussed', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'illusion', 'charm'],
                hand: [],
                spellboard: ['abundance', 'abundance']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('protects the user reducing damage equal to the focus level', function () {
        let oppDeck = this.player2.deck.length;
        let deck = this.player1.deck.length;

        this.player1.clickCard(this.abundance);
        this.player1.clickPrompt('Abundance');
        this.player2.clickPrompt('2');
        // draw refused
        this.player1.clickPrompt('0');

        expect(this.player2.deck.length).toBe(oppDeck - 2);
        expect(this.player2.phoenixborn.damage).toBe(0);
        // damage taken but no draw
        expect(this.player1.deck.length).toBe(deck);
        expect(this.player1.phoenixborn.damage).toBe(1);
    });
});
