describe('Summon Frost Talon', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['summon-frost-talon'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['frost-talon']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a frost talon', function () {
            this.player1.clickCard(this.summonFrostTalon);
            this.player1.clickPrompt('Summon Frost Talon');
            expect(this.frostTalon.location).toBe('play area');
        });
    });
});
