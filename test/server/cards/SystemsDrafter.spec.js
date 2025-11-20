describe('Systems Drafter', function () {
    describe('Rethink 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'issa-brightmore',
                    spellboard: ['summon-thunder-hulk'],
                    dicepool: ['artifice', 'artifice', 'basic', 'basic'],
                    archives: ['thunder-hulk'],
                    inPlay: ['anchornaut'],
                    hand: ['systems-drafter']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
            this.summonThunderHulk.tokens.exhaustion = 1;
        });

        it('remove 1 exhaustion from a ready spell', function () {
            expect(this.summonThunderHulk.exhausted).toBe(true);
            this.player1.play(this.systemsDrafter);
            expect(this.systemsDrafter.location).toBe('play area');
            this.player1.clickCard(this.summonThunderHulk);
            expect(this.summonThunderHulk.exhausted).toBe(false);
        });
    });
});
