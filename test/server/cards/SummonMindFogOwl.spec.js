describe('Summon Mind Fog Owl', function () {
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

    it('should place an owl into play', function () {
        this.player1.dicepool[0].level = 'class';
        this.player1.clickCard(this.summonMindFogOwl);
        this.player1.clickPrompt('Summon Mind Fog Owl');
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.player1.archives[0]);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.mindFogOwl.location).toBe('play area');
    });

    it('can resolve a charm die if power used', function () {
        this.player1.clickCard(this.summonMindFogOwl);
        this.player1.clickPrompt('Summon Mind Fog Owl');
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.player1.archives[0]);
        expect(this.mindFogOwl.location).toBe('play area');
        expect(this.player1).not.toHaveDefaultPrompt();

        this.player1.clickCard(this.hammerKnight);
        expect(this.hammerKnight.attack).toBe(2);
        expect(this.hammerKnight.dieUpgrades.length).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
