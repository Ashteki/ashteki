describe('Purge with focus', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['charm', 'ceremonial'],
                hand: [],
                spellboard: ['purge', 'purge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('allows second deck discard', function () {
        let oppDeck = this.player2.deck.length;
        this.player1.clickCard(this.purge);
        this.player1.clickPrompt('Purge');
        expect(this.player2.deck.length).toBe(oppDeck - 1);

        this.player1.clickDie(1);
        expect(this.player2.deck.length).toBe(oppDeck - 2);
    });

    it('allows refusal of second deck discard', function () {
        let oppDeck = this.player2.deck.length;
        this.player1.clickCard(this.purge);
        this.player1.clickPrompt('Purge');
        expect(this.player2.deck.length).toBe(oppDeck - 1);

        this.player1.clickPrompt('Cancel');
        expect(this.player2.deck.length).toBe(oppDeck - 1);
    });
});
