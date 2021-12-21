describe('Redirect reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: ['butterfly-monk'],
                hand: ['one-hundred-blades']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight'],
                spellboard: [],
                hand: ['redirect'],
                dicepool: ['natural', 'natural', 'charm']
            }
        });
    });

    it('can be played when a phoenixborn takes attack damage', function () {
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
        expect(this.player2.dicepool[2].exhausted).toBe(true);
    });

    it('can be cancelled', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.mistSpirit); // single attacker
        this.player1.clickPrompt('Done'); // end attacker select
        this.player2.clickPrompt('Done'); // don't place blocker

        // any interrupts?
        this.player2.clickCard(this.redirect); // click redirect to play as reaction
        this.player2.clickPrompt('Cancel');

        expect(this.redirect.location).toBe('hand');
        expect(this.coalRoarkwin.tokens.damage).toBe(this.mistSpirit.attack);
        expect(this.player2.dicepool[2].exhausted).toBe(false);
    });

    it('can be played when a phoenixborn takes One Hundred Blades damage', function () {
        expect(this.hammerKnight.tokens.damage).toBeUndefined;

        this.player1.play(this.oneHundredBlades);
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDone();
        this.player1.clickCard(this.coalRoarkwin);
        // any interrupts?
        this.player2.clickCard(this.redirect); // click redirect to play as reaction
        this.player2.clickCard(this.hammerKnight); // redirect damage to hammerKnight

        expect(this.redirect.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.hammerKnight);
        expect(this.hammerKnight.damage).toBe(2);
        expect(this.coalRoarkwin.tokens.damage).toBeUndefined;
    });
});
