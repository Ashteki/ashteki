describe('Mass Heal action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['hammer-knight'],
                dicepool: ['divine', 'charm'],
                hand: ['mass-heal'],
                spellboard: ['chant-of-revenge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['silver-snake', 'mist-spirit'],
                spellboard: []
            }
        });

        this.hammerKnight.tokens.damage = 1;
        this.silverSnake.tokens.damage = 1;
        this.odetteDiamondcrest.tokens.damage = 1;
        this.aradelSummergaard.tokens.damage = 1;
    });

    it('heals all MY units plus pb', function () {
        this.player1.clickCard(this.massHeal);
        this.player1.clickPrompt('Play this action');
        this.player1.clickPrompt('Heal your units and PB');

        expect(this.hammerKnight.damage).toBe(0);
        expect(this.silverSnake.damage).toBe(1);
        expect(this.aradelSummergaard.damage).toBe(1);
        expect(this.odetteDiamondcrest.damage).toBe(0);
    });

    it('heals all units (no PB) including opponents if I select the option', function () {
        this.player1.clickCard(this.massHeal);
        this.player1.clickPrompt('Play this action');
        this.player1.clickPrompt('Remove wounds from all units');

        expect(this.hammerKnight.damage).toBe(0);
        expect(this.silverSnake.damage).toBe(0);
        expect(this.aradelSummergaard.damage).toBe(1);
        expect(this.odetteDiamondcrest.damage).toBe(1);
    });

    it('heals all units (no PB) including opponents if no divine power/class', function () {
        this.player1.dicepool[0].level = 'basic';

        this.player1.clickCard(this.massHeal);
        this.player1.clickPrompt('Play this action');

        this.player1.clickPrompt('Remove wounds from all units');

        expect(this.hammerKnight.damage).toBe(0);
        expect(this.silverSnake.damage).toBe(0);
        expect(this.aradelSummergaard.damage).toBe(1);
        expect(this.odetteDiamondcrest.damage).toBe(1);
    });
});
