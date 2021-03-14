describe('Sacred Ground', function () {
    describe('Armor action - my units', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'blue-jaguar'],
                    spellboard: ['sacred-ground'],
                    dicepool: ['natural', 'natural', 'charm', 'divine'],
                    archives: ['butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should give my units armour 1', function () {
            this.player1.clickCard(this.sacredGround);
            this.player1.clickPrompt('Sacred Ground');

            // check spellboard is still just 1
            expect(this.mistSpirit.armor).toBe(1);
            expect(this.blueJaguar.armor).toBe(1);
            expect(this.hammerKnight.armor).toBe(0);

            this.player1.endTurn();
            expect(this.mistSpirit.armor).toBe(1);
            expect(this.blueJaguar.armor).toBe(1);
            expect(this.hammerKnight.armor).toBe(0);

            this.player2.endTurn();
            expect(this.mistSpirit.armor).toBe(0);
            expect(this.blueJaguar.armor).toBe(0);
            expect(this.hammerKnight.armor).toBe(0);
        });
    });
});
