describe('Ancestral Army', function () {
    describe('On Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['ancestral-army'],
                    archives: ['ancestor-spirit', 'ancestor-spirit']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['flute-mage'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('invokes ancestors', function () {
            this.player1.clickCard(this.ancestralArmy);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDone();
            expect(this.ancestralArmy.location).toBe('play area');
            expect(this.ancestorSpirit.location).toBe('play area');
            expect(this.player1.archives.length).toBe(0);
        });
    });
});
