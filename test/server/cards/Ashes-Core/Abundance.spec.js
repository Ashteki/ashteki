describe('Abundance', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'illusion', 'charm'],
                hand: [],
                spellboard: ['abundance']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('prompts for forced card draw', function () {
        let oppDeck = this.player2.deck.length;
        let deck = this.player1.deck.length;

        this.player1.clickCard(this.abundance);
        this.player1.clickPrompt('Abundance');
        expect(this.player2).toHavePrompt('Draw or damage: choose number of cards to draw');
        expect(this.player2.player.promptState.buttons.length).toBe(3);
        this.player2.clickPrompt('2');
        expect(this.player2).toHavePrompt('Waiting for opponent');
        // draw refused
        this.player1.clickPrompt('0');

        expect(this.player2.deck.length).toBe(oppDeck - 2);
        expect(this.player2.phoenixborn.damage).toBe(0);
        // damage taken but no draw
        expect(this.player1.deck.length).toBe(deck);
        expect(this.player1.phoenixborn.damage).toBe(2);

        expect(this.player1).toHavePrompt('Choose a card to play or use');
    });
});
