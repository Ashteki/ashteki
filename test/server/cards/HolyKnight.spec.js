describe('Holy Knight', function () {
    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['holy-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['crystal-shield'],
                    archives: ['ancestor-spirit', 'ancestor-spirit']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['flute-mage'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('can be target for own alterations', function () {
            this.player1.play(this.crystalShield);
            this.player1.clickDie(2);
            this.player1.clickDone();
            this.player1.clickCard(this.holyKnight);

            expect(this.holyKnight.upgrades.length).toBe(1);
            expect(this.crystalShield.location).toBe('play area');
        });
    });
});
