describe('Summon Indiglow Creeper', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                    spellboard: [
                        'summon-butterfly-monk',
                        'abundance',
                        'summon-gilder',
                        'summon-indiglow-creeper',
                        'summon-indiglow-creeper'
                    ],
                    hand: ['summon-masked-wolf', 'summon-gilder', 'resonance'],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy', 'charm', 'charm'],
                    archives: ['indiglow-creeper']
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

        it('focus effect', function () {
            this.player1.clickCard(this.summonIndiglowCreeper);
            this.player1.clickPrompt('Summon Indiglow Creeper');
            expect(this.indiglowCreeper.location).toBe('play area');
            expect(this.indiglowCreeper.status).toBe(0);
            this.player1.clickCard(this.indiglowCreeper);
            expect(this.indiglowCreeper.status).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Summon when creeper in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['indiglow-creeper', 'mist-spirit', 'iron-worker'],
                    spellboard: [
                        'summon-butterfly-monk',
                        'abundance',
                        'summon-gilder',
                        'summon-indiglow-creeper',
                        'summon-indiglow-creeper'
                    ],
                    hand: ['summon-masked-wolf', 'summon-gilder', 'resonance'],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy', 'charm', 'charm'],
                    archives: []
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

        it('focus effect triggers without second summon', function () {
            expect(this.indiglowCreeper.location).toBe('play area');
            expect(this.indiglowCreeper.status).toBe(0);
            this.player1.clickCard(this.summonIndiglowCreeper);
            this.player1.clickPrompt('Summon Indiglow Creeper');

            this.player1.clickCard(this.indiglowCreeper);
            expect(this.indiglowCreeper.status).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
