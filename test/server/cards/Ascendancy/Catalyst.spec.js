describe('Catalyst', function () {
    describe('Commander', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'maeve-luminvale',
                    spellboard: ['summon-thunder-hulk'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: [],
                    inPlay: ['anchornaut', 'capacitor-beetle', 'thunder-hulk'],
                    hand: ['catalyst', 'iron-worker'],
                    deck: ['purge', 'summon-gilder']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('add 1 to another units attack', function () {
            expect(this.player1.hand.length).toBe(2);
            this.player1.attachDie(0, this.capacitorBeetle);
            this.player1.play(this.catalyst);
            expect(this.player1.hand.length).toBe(2);
            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.isCharged).toBe(true);
            // move die
            this.player1.clickDieUpgrade(this.capacitorBeetle, 0);
            this.player1.clickCard(this.thunderHulk);
            expect(this.thunderHulk.isCharged).toBe(true);
            expect(this.capacitorBeetle.isCharged).toBe(false);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

});
