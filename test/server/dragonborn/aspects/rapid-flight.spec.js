describe('Rapid Flight', function () {
    describe('When Attacking', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    spellboard: [],
                    inPlay: ['rapid-flight'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
        });

        it('has quickstrike', function () {
            this.player1.endTurn();
            // rapid flight attacks
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.rapidFlight.exhausted).toBe(true);
            expect(this.mistSpirit.location).toBe('archives');
        });
    });
});
