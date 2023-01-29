describe('Spectral Charger Mount ', function () {
    describe('ice trap and ally destination', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['fire-archer', 'mist-spirit'],
                    spellboard: ['summon-ghostly-mount'],
                    dicepool: ['natural', 'illusion', 'sympathy', 'sympathy'],
                    archives: ['spectral-charger-mount']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['ice-trap', 'safeguard']
                }
            });
        });

        it('opponent plays ice trap, ally goes back to hand', function () {
            this.player1.clickCard(this.summonGhostlyMount);
            this.player1.clickPrompt('Summon Ghostly Mount');
            this.player1.clickPrompt('Main');

            this.player1.clickCard(this.fireArcher);
            this.player1.clickCard(this.spectralChargerMount);
            expect(this.spectralChargerMount.location).toBe('play area')
            this.player2.clickCard(this.iceTrap);

            expect(this.spectralChargerMount.location).toBe('archives');
            expect(this.fireArcher.location).toBe('hand');
        });
    });
});
