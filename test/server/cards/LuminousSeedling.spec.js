describe('Luminous Seedling', function () {
    describe('Blossom', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['luminous-seedling', 'mist-spirit', 'iron-worker'],
                    spellboard: [
                        'summon-butterfly-monk',
                        'summon-indiglow-creeper'
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

        it('summons brilliant thorn when 2 status', function () {
            this.luminousSeedling.tokens.status = 2;
            this.player1.clickCard(this.luminousSeedling);
            this.player1.clickPrompt('Blossom');
            expect(this.brilliantThorn.location).toBe('play area');
            expect(this.luminousSeedling.location).toBe('archives');

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('does not summon brilliant thorn with 1 status', function () {
            this.luminousSeedling.tokens.status = 1;

            this.player1.clickCard(this.luminousSeedling);
            this.player1.clickPrompt('Blossom');
            expect(this.brilliantThorn.location).toBe('archives');
            expect(this.luminousSeedling.location).toBe('archives');

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Blossom with Fighting Spirit', function () {
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

        it('triggers fighting spirit with 2 status', function () {
            this.luminousSeedling.tokens.status = 2;

            this.player1.clickCard(this.luminousSeedling);
            this.player1.clickPrompt('Blossom');
            expect(this.brilliantThorn.location).toBe('play area');
            expect(this.luminousSeedling.location).toBe('archives');
            expect(this.fightingSpirit.status).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('triggers fighting spirit with 1 status', function () {
            this.luminousSeedling.tokens.status = 1;

            this.player1.clickCard(this.luminousSeedling);
            this.player1.clickPrompt('Blossom');
            expect(this.brilliantThorn.location).toBe('archives');
            expect(this.luminousSeedling.location).toBe('archives');
            expect(this.fightingSpirit.status).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
