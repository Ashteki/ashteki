describe('rins fury reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['mist-spirit', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: [],
                hand: ['freezing-blast']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                spellboard: [],
                hand: ['rins-fury'],
                dicepool: ['natural', 'natural']
            }
        });
    });

    it('can be played when a unit takes damage', function () {
        expect(this.ironWorker.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight); // target
        this.player1.clickCard(this.ironWorker); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.player2).toBeAbleToSelect(this.rinsFury);
        this.player2.clickCard(this.rinsFury); // click cover to play as reaction
        this.player2.clickDie(0);
        this.player2.clickDie(1);
        this.player2.clickPrompt('Done');

        // card played
        expect(this.rinsFury.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        // damage dealt to attacker
        expect(this.ironWorker.location).toBe('discard');
        expect(this.hammerKnight.damage).toBe(0);
    });
});
