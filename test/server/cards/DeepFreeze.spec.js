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
        expect(this.ironWorker.exhausted).toBe(false);

        this.player1.clickCard(this.deepFreeze); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.ironWorker); // attach to ms
        expect(this.ironWorker.exhausted).toBe(true);
        expect(this.deepFreeze.status).toBe(3);
        expect(this.deepFreeze.controller.name).toBe(this.player2.name);

        this.player1.endTurn();
        // can i use thaw?
        this.player2.clickCard(this.ironWorker);
        this.player2.clickPrompt('Thaw');
        expect(this.deepFreeze.status).toBe(2);
    });

    it('disposed when status token is cleared', function () {
        expect(this.ironWorker.exhausted).toBe(false);

        this.player1.clickCard(this.deepFreeze); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.ironWorker); // attach to ms
        expect(this.ironWorker.exhausted).toBe(true);
        expect(this.deepFreeze.status).toBe(3);
        expect(this.deepFreeze.controller.name).toBe(this.player2.name);

        this.player1.endTurn();
        this.deepFreeze.tokens.status = 1;

        // can i use thaw?
        this.player2.clickCard(this.ironWorker);
        this.player2.clickPrompt('Thaw');
        expect(this.deepFreeze.location).toBe('discard');
        expect(this.ironWorker.location).toBe('play area');
    });
});
