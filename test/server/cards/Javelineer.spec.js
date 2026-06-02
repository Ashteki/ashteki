describe('Javelineer', function () {
    describe('Frost Throw', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['summon-thunder-hulk'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: ['thunder-hulk'],
                    inPlay: ['javelineer'],
                    hand: ['systems-drafter']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('deal damage equal to javelineer attack (1)', function () {
            this.player1.clickCard(this.javelineer);
            this.player1.clickPrompt('Frost Throw');
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);
        });
    });
});
