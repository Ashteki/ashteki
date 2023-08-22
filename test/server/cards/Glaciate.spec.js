describe('Glaciate', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit'],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: ['close-combat', 'glaciate']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['natural']
            }
        });
    });

    it('makes target card exhausted and prevents all damage. fleeting', function () {
        expect(this.ironWorker.exhausted).toBe(false);

        this.player1.clickCard(this.glaciate); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.mistSpirit); // attach to ms
        expect(this.mistSpirit.exhausted).toBe(true);
        expect(this.glaciate.controller.name).toBe(this.player1.name);

        this.player1.endTurn();
        // can i use thaw?
        this.player2.clickAttack(this.mistSpirit);
        this.player2.clickCard(this.ironWorker);
        this.player1.clickDone();

        expect(this.mistSpirit.location).toBe('play area');
        expect(this.mistSpirit.damage).toBe(0);
        this.player2.endTurn();

        this.player1.endTurn();
        this.player2.endTurn();
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.glaciate.location).toBe('discard');
    });
});
