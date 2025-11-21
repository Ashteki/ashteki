describe('Skybreak Captain', function () {
    describe('Commander', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'issa-brightmore',
                    spellboard: ['summon-thunder-hulk'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: ['thunder-hulk'],
                    inPlay: ['anchornaut', 'skybreak-captain']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('add 1 to another units attack', function () {
            this.player1.clickCard(this.skybreakCaptain);
            this.player1.clickPrompt('Commander 1');
            this.player1.clickCard(this.anchornaut);
            expect(this.anchornaut.attack).toBe(1);
        });
    });
});
