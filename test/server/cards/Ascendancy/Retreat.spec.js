describe('Retreat', function () {
    describe('Action Spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['supercharge', 'retreat'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['spark-drone'],
                    inPlay: ['anchornaut', 'iron-worker'],
                    hand: ['purge', 'massive-growth', 'retreat'],
                    deck: ['sleeping-bear', 'hammer-knight', 'flute-mage']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-rhino'],
                    dicepool: ['artifice', 'ceremonial', 'natural', 'natural'],
                    spellboard: []
                }
            });
        });

        it('returns exhausted ally and all alterations to hand', function () {
            this.player1.attachUpgrade(this.massiveGrowth, this.anchornaut);
            this.anchornaut.exhaust();

            this.player1.play(this.retreat);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.anchornaut);

            expect(this.anchornaut.location).toBe('hand');
            expect(this.massiveGrowth.location).toBe('hand');
        });
    });
});
