describe('Tash Cantasita Steal ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'tash-cantasita',
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
                hand: ['freezing-blast'],
                discard: ['holy-relics']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: [],
                hand: ['anchornaut'],
                dicepool: ['natural', 'natural']
            }
        });
    });

    it('when my unit deals damage to opponents pb by attacking ', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.ironWorker);
        this.player1.clickDone();

        this.player2.clickPrompt('Done'); // no blockers

        this.player1.clickCard(this.ironWorker);
        expect(this.player2.discard.length).toBe(1);

        this.player1.clickCard(this.holyRelics); // click cover to play as reaction
        expect(this.holyRelics.location).toBe('hand');
        expect(this.player1.hand.length).toBe(2);

        this.player1.clickCard(this.mistSpirit);
        // card played
        expect(this.coalRoarkwin.damage).toBe(3);
        expect(this.player1).toHaveDefaultPrompt();
    });

});
