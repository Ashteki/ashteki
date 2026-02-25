describe('Core Supplier', function () {
    describe('On Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'issa-brightmore',
                    spellboard: ['summon-thunder-hulk'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: ['thunder-hulk'],
                    inPlay: ['javelineer'],
                    hand: ['systems-drafter', 'core-supplier']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('place 2 exhausted dice onto cards', function () {
            this.player1.play(this.coreSupplier);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickCard(this.javelineer);
            this.player1.clickCard(this.summonThunderHulk);

            expect(this.javelineer.isCharged).toBe(true);
            expect(this.summonThunderHulk.isCharged).toBe(true);
        });
    });
});
