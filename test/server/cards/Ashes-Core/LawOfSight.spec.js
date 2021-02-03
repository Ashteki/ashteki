describe('law of sight', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['mist-spirit', 'iron-worker'],
                dicepool: ['divine', 'divine', 'charm', 'charm'],
                hand: ['law-of-sight']
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

    it('draw prompt when played', function () {
        this.player1.clickCard(this.lawOfSight); // target
        this.player1.clickPrompt('Play this ready spell');
        this.player1.clickDie(3);
        this.player1.clickPrompt('Done');

        expect(this.player1).toHavePromptButton('Yes'); // (optional draw)
    });
});
