describe('Salamander Monk', function () {
    describe('destruction with space in battlefield', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'power-through']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin', // battlefield 6
                    inPlay: ['mist-spirit', 'anchornaut', 'hammer-knight', 'salamander-monk'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['salamander-monk-spirit']
                }
            });
        });

        it('on destroy summons spirit', function () {
            expect(this.salamanderMonk.location).toBe('play area');
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.salamanderMonk);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('No');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.salamanderMonk.location).toBe('archives');
            expect(this.salamanderMonkSpirit.location).toBe('play area');
        });
    });

    describe('Salamander Monk battlefield full', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'power-through']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [
                        'mist-spirit',
                        'anchornaut',
                        'mist-spirit',
                        'anchornaut',
                        'hammer-knight',
                        'salamander-monk'
                    ],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['salamander-monk-spirit']
                }
            });
        });

        it('on destroy summons spirit when battlefield full (replacing self)', function () {
            expect(this.salamanderMonk.location).toBe('play area');
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.salamanderMonk);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('No');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.salamanderMonk.location).toBe('archives');
            expect(this.salamanderMonkSpirit.location).toBe('play area');
        });
    });

    describe('destruction interaction with meteor', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    dicepool: ['divine', 'divine', 'divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['meteor', 'power-through']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin', // battlefield 6
                    inPlay: ['mist-spirit', 'anchornaut', 'hammer-knight', 'salamander-monk'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['salamander-monk-spirit']
                }
            });
        });

        it('on destroy summons spirit', function () {
            expect(this.salamanderMonk.location).toBe('play area');
            this.player1.play(this.meteor);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.salamanderMonk);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            // meteor 2
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.salamanderMonkSpirit);
            this.player1.clickCard(this.ironWorker);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.salamanderMonk.location).toBe('archives');
            expect(this.salamanderMonkSpirit.location).toBe('archives');
        });
    });

});
