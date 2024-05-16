describe('Luminous Seedling', function () {
    describe('Blossom', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['luminous-seedling', 'mist-spirit', 'iron-worker'],
                    spellboard: [
                        'summon-butterfly-monk',
                        'summon-indiglow-creeper',
                        'fighting-spirit'
                    ],
                    hand: ['summon-masked-wolf', 'summon-gilder', 'resonance'],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy', 'charm', 'charm'],
                    archives: ['indiglow-creeper', 'brilliant-thorn']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('triggers fighting spirit with 3 status', function () {
            this.luminousSeedling.tokens.status = 3;

            this.player1.clickCard(this.luminousSeedling);
            this.player1.clickPrompt('Blossom');
            expect(this.brilliantThorn.location).toBe('play area');
            expect(this.luminousSeedling.location).toBe('archives');
            expect(this.fightingSpirit.status).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('does not trigger fighting spirit with 2 status', function () {
            this.luminousSeedling.tokens.status = 2;

            this.player1.clickCard(this.luminousSeedling);
            this.player1.clickPrompt('Blossom');
            expect(this.brilliantThorn.location).toBe('play area');
            expect(this.luminousSeedling.location).toBe('archives');
            expect(this.fightingSpirit.status).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
