describe('Chimera setup', function () {
    describe('Threat Zone', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('should be length 4 and 1,2,2,2 for viros 1', function () {
            expect(this.player2.threatZone.length).toBe(4);
            expect(this.player2.threatZone[0].blood).toBe(1);
            expect(this.player2.threatZone[1].blood).toBe(2);
            expect(this.player2.threatZone[2].blood).toBe(2);
            expect(this.player2.threatZone[3].blood).toBe(2);
        });
    });
});
