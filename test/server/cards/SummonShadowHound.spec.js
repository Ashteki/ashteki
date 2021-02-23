describe('Summon Shadow Hound', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-shadow-hound'],
                    dicepool: ['charm', 'illusion', 'illusion', 'illusion'],
                    archives: ['shadow-hound']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a shadow hound into play', function () {
            this.player1.clickCard(this.summonShadowHound);
            this.player1.clickPrompt('Summon Shadow Hound');
            this.player1.clickCard(this.player1.archives[0]);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.shadowHound.location).toBe('play area');
        });
    });

    describe('Summon Focus 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-shadow-hound', 'summon-shadow-hound'],
                    dicepool: ['charm', 'illusion', 'illusion', 'illusion'],
                    archives: ['shadow-hound']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should give optional damage to a unit', function () {
            this.player1.clickCard(this.summonShadowHound);
            this.player1.clickPrompt('Summon Shadow Hound');
            this.player1.clickCard(this.player1.archives[0]);
            expect(this.player1).not.toHaveDefaultPrompt();
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Summon Focus 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: [
                        'summon-shadow-hound',
                        'summon-shadow-hound',
                        'summon-shadow-hound'
                    ],
                    dicepool: ['charm', 'illusion', 'illusion', 'illusion'],
                    archives: ['shadow-hound']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should give optional damage to a unit', function () {
            this.player1.clickCard(this.summonShadowHound);
            this.player1.clickPrompt('Summon Shadow Hound');
            this.player1.clickCard(this.player1.archives[0]);

            expect(this.player1).not.toHaveDefaultPrompt(); // focus 1 +
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);

            expect(this.player1).not.toHaveDefaultPrompt(); // focus 2
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(2);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Focus 2 damage when no summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: [
                        'summon-shadow-hound',
                        'summon-shadow-hound',
                        'summon-shadow-hound'
                    ],
                    dicepool: ['charm', 'illusion', 'illusion', 'illusion'],
                    archives: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should give optional damage prompts', function () {
            this.player1.clickCard(this.summonShadowHound);
            this.player1.clickPrompt('Summon Shadow Hound');

            expect(this.player1).not.toHaveDefaultPrompt(); // focus 1 +
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(1);

            expect(this.player1).not.toHaveDefaultPrompt(); // focus 2
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.damage).toBe(2);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
