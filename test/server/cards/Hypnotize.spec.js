describe('Hypnotize', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker'],
                spellboard: ['hypnotize'],
                dicepool: ['charm', 'charm', 'illusion'],
                hand: ['reflections-in-the-water']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: []
            }
        });
    });

    it('grants bypass to target', function () {
        expect(this.ironWorker.anyEffect('bypass')).toBe(false);
        this.player1.clickCard(this.hypnotize);
        this.player1.clickPrompt('Hypnotize a unit');
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.anyEffect('bypass')).toBe(true);
    });

    it('bypass is removed at turn end', function () {
        expect(this.ironWorker.anyEffect('bypass')).toBe(false);
        this.player1.clickCard(this.hypnotize);
        this.player1.clickPrompt('Hypnotize a unit');
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.anyEffect('bypass')).toBe(true);

        this.player1.clickPrompt('End Turn');

        expect(this.ironWorker.anyEffect('bypass')).toBe(false);
    });
});
