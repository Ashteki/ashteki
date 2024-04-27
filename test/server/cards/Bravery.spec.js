describe('Bravery reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: [
                    'mist-spirit',
                    'iron-worker',
                    'fallen',
                    'squall-stallion',
                    'stormwind-sniper',
                    'shadow-hound'
                ],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: [],
                hand: ['freezing-blast']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                spellboard: [],
                hand: ['bravery'],
                dicepool: ['divine', 'natural']
            }
        });
    });

    it('can be played when a unit takes damage', function () {
        this.player1.clickAttack(this.hammerKnight);
        this.player1.clickCard(this.ironWorker); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.player2).toBeAbleToSelect(this.bravery);
        this.player2.clickCard(this.bravery); // click cover to play as reaction

        expect(this.hammerKnight.damage).toBe(0);
    });
});
