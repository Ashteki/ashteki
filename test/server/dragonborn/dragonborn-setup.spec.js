describe('Dragonborn setup', function () {
    describe('Threat Zone', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',

                    spellboard: [],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
        });

        it('should be length 4 and alternate 1 blood 2 blood', function () {
            expect(this.player2.threatZone.length).toBe(4);

            expect(this.player2.threatZone[0].blood).toBe(1);
            expect(this.player2.threatZone[1].blood).toBe(2);
            expect(this.player2.threatZone[2].blood).toBe(1);
            expect(this.player2.threatZone[3].blood).toBe(2);
            expect(this.player2.threatZone[0].facedown).toBe(true);
            expect(this.player2.threatZone[1].facedown).toBe(true);
            expect(this.player2.threatZone[2].facedown).toBe(true);
            expect(this.player2.threatZone[3].facedown).toBe(true);
            expect(this.player2.inPlay.length).toBe(0);

            expect(this.player2.player.unitsInPlay.length).toBe(0);
        });
    });
});
