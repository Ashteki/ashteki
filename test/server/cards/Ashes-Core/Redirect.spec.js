describe('Redirect reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: ['butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight'],
                spellboard: [],
                hand: ['redirect'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            }
        });
    });

    it('can be played when a phoenixborn takes damage', function () {
        expect(this.hammerKnight.tokens.damage).toBeUndefined;

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.mistSpirit); // single attacker
        this.player1.clickPrompt('Done'); // end attacker select
        this.player2.clickPrompt('Done'); // don't place blocker

        // any interrupts?
        this.player2.clickCard(this.redirect); // click redirect to play as reaction
        this.player2.clickCard(this.hammerKnight); // redirect damage to hammerKnight

        expect(this.redirect.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        expect(this.hammerKnight.tokens.damage).toBe(this.mistSpirit.attack);
        expect(this.coalRoarkwin.tokens.damage).toBeUndefined;
        expect(this.mistSpirit.tokens.damage).toBeUndefined;
    });
});
