describe('Dragon Rage', function () {
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
                    inPlay: ['dragon-rage'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
        });

        it('place 1 status on dragonborn', function () {
            expect(this.scathaKalani.status).toBe(0);
            this.player1.endTurn();
            // dragon rage attacks
            this.player1.clickDone(); // guard
            expect(this.dragonRage.isAttacker).toBe(true);
            expect(this.scathaKalani.status).toBe(1);
            this.player1.clickYes(); // counter
            expect(this.dragonRage.exhausted).toBe(true);
            expect(this.blueJaguar.location).toBe('archives');
            expect(this.dragonRage.damage).toBe(1);
        });
    });
});
