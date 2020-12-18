describe('Deep Freeze', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit'],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: ['close-combat', 'deep-freeze']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker']
            }
        });
    });

    it('makes target card exhausted with thaw action', function () {
        expect(this.mistSpirit.exhausted).toBe(false);

        this.player1.clickCard(this.deepFreeze); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.mistSpirit); // attach to ms
        expect(this.mistSpirit.exhausted).toBe(true);
        expect(this.deepFreeze.status).toBe(3);

        // can i use thaw?
        expect(this.player1.actions.side).toBe(true);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickPrompt('Thaw');
        expect(this.deepFreeze.status).toBe(2);
    });

    it('disposed when status token is cleared', function () {
        expect(this.mistSpirit.exhausted).toBe(false);

        this.player1.clickCard(this.deepFreeze); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.mistSpirit); // attach to ms
        expect(this.mistSpirit.exhausted).toBe(true);
        expect(this.deepFreeze.status).toBe(3);
        // fudge the token count
        this.deepFreeze.tokens.status = 1;

        // can i use thaw?
        expect(this.player1.actions.side).toBe(true);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickPrompt('Thaw');
        expect(this.deepFreeze.location).toBe('discard');
    });
});
