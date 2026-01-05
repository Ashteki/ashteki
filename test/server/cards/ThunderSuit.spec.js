describe('Thunder Suit', function () {
    describe('Attach', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'issa-brightmore',
                    spellboard: ['supercharge'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: ['spark-drone'],
                    inPlay: ['anchornaut'],
                    hand: ['thunder-suit']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('adds stats and smuggles an artifice die onto the host', function () {
            this.player1.clickCard(this.thunderSuit);
            this.player1.clickPrompt('Play This Alteration');
            this.player1.clickDie(2);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.anchornaut);
            this.player1.clickDie(0); // smuggle
            expect(this.anchornaut.attack).toBe(2);
            expect(this.anchornaut.life).toBe(3);
            expect(this.anchornaut.recover).toBe(2);
            expect(this.anchornaut.dieUpgrades.length).toBe(1);
            expect(this.anchornaut.isCharged).toBe(true);
        });
    });
});
