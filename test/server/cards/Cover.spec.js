describe('Cover reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: ['butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                hand: ['cover'],
                dicepool: ['natural']
            }
        });
    });

    it('can be played when a phoenixborn guards and takes damage', function () {
        expect(this.coalRoarkwin.tokens.damage).toBeUndefined;
        expect(this.ironWorker.tokens.damage).toBeUndefined;

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.ironWorker); // single attacker

        this.player2.clickCard(this.coalRoarkwin); // guard with pb
        this.player2.clickCard(this.cover); // click cover to play as reaction

        // card played
        expect(this.cover.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        // damage prevented to pb
        expect(this.coalRoarkwin.tokens.damage).toBeUndefined;
        expect(this.coalRoarkwin.usedGuardThisRound).toBe(true);

        // damage dealt to attacker
        expect(this.ironWorker.tokens.damage).toBe(1);
    });

    it('cannot be played when a takes direct damage', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.mistSpirit); // single attacker
        this.player1.clickPrompt('Done'); // end attacker select
        this.player2.clickPrompt('Done'); // don't place blocker
        this.player2.clickCard(this.cover); // click cover to play as reaction

        expect(this.cover.location).toBe('hand');
        expect(this.player2.hand.length).toBe(1);
        expect(this.coalRoarkwin.tokens.damage).toBe(1);
        expect(this.coalRoarkwin.usedGuardThisRound).toBe(false);
    });
});
