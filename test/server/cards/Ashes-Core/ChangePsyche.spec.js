describe('Change Psyche played', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit'],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: ['change-psyche']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker']
            }
        });
    });

    it('makes target card exhausted', function () {
        expect(this.mistSpirit.exhausted).toBe(false);

        this.player1.clickCard(this.changePsyche); // play card
        this.player1.clickPrompt('Play this Action');
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.mistSpirit); // attach to ms
        this.player1.clickPrompt('Add token');
        expect(this.mistSpirit.exhausted).toBe(true);
    });

    it('removes exhaustion token', function () {
        this.mistSpirit.tokens.exhaustion = 2;
        expect(this.mistSpirit.exhausted).toBe(true);
        expect(this.mistSpirit.tokens.exhaustion).toBe(2);

        this.player1.clickCard(this.changePsyche); // play card
        this.player1.clickPrompt('Play this Action');
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.mistSpirit); // attach to ms
        this.player1.clickPrompt('Remove token');
        expect(this.mistSpirit.exhausted).toBe(true);
        expect(this.mistSpirit.tokens.exhaustion).toBe(1);
    });
});
