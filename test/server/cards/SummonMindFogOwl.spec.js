describe('Summon Mind Fog Owl', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-mind-fog-owl'],
                    dicepool: ['charm', 'divine', 'illusion'],
                    archives: ['mind-fog-owl']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place an owl into play - class die', function () {
            this.player1.dicepool[0].level = 'class';
            this.player1.clickCard(this.summonMindFogOwl);
            this.player1.clickPrompt('Summon Mind Fog Owl');
            this.player1.clickDie(2);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.mindFogOwl.location).toBe('play area');
        });

        it('should place an owl into play - power die', function () {
            this.player1.clickCard(this.summonMindFogOwl);
            this.player1.clickPrompt('Summon Mind Fog Owl');
            this.player1.clickDie(2);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.mindFogOwl.location).toBe('play area');
        });
    });

    describe('Focus summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-mind-fog-owl', 'summon-mind-fog-owl'],
                    dicepool: ['charm', 'divine', 'illusion'],
                    archives: ['mind-fog-owl']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('can resolve a charm die if power used', function () {
            this.player1.clickCard(this.summonMindFogOwl);
            this.player1.clickPrompt('Summon Mind Fog Owl');
            this.player1.clickDie(2);
            this.player1.clickPrompt('Done');
            expect(this.mindFogOwl.location).toBe('play area');
            expect(this.player1).not.toHaveDefaultPrompt();

            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.attack).toBe(2);
            expect(this.hammerKnight.dieUpgrades.length).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
