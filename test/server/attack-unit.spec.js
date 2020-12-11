describe('Unit attacks', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk']
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

    it('defender may choose not to counter', function () {
        expect(this.fluteMage.tokens.damage).toBeUndefined();
        expect(this.mistSpirit.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.mistSpirit); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.fluteMage.tokens.damage).toBe(1);
        expect(this.mistSpirit.tokens.damage).toBeUndefined();
        expect(this.fluteMage.exhausted).toBe(false);
        expect(this.mistSpirit.exhausted).toBe(true);
    });

    it('defender may choose to guard with phoenixborn', function () {
        expect(this.fluteMage.tokens.damage).toBeUndefined();
        expect(this.mistSpirit.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.mistSpirit); // single attacker

        this.player2.clickCard(this.coalRoarkwin); // guard with pb

        // no damage to target (flutey) or attacker (mist spirit)
        expect(this.fluteMage.location).toBe('play area');
        expect(this.fluteMage.tokens.damage).toBeUndefined();
        expect(this.mistSpirit.location).toBe('play area');
        expect(this.mistSpirit.tokens.damage).toBeUndefined();
        // damage to pb, and guarded token
        expect(this.coalRoarkwin.tokens.damage).toBe(1);
        expect(this.coalRoarkwin.usedGuardThisRound).toBe(true);
        expect(this.fluteMage.exhausted).toBe(false);
        expect(this.mistSpirit.exhausted).toBe(true);
    });

    it('defender may choose to counter', function () {
        expect(this.fluteMage.tokens.damage).toBeUndefined();
        expect(this.blueJaguar.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.blueJaguar); // single attacker
        this.player1.clickPrompt('Done'); // no blue jag ability

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('Yes'); // DO counter

        expect(this.fluteMage.tokens.damage).toBe(this.blueJaguar.attack);
        expect(this.blueJaguar.tokens.damage).toBe(this.fluteMage.attack);
        expect(this.fluteMage.exhausted).toBe(true);
        expect(this.blueJaguar.exhausted).toBe(true);
    });

    it('simultaneous damage dealt from destroyed attacker', function () {
        expect(this.fluteMage.tokens.damage).toBeUndefined();
        expect(this.mistSpirit.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.mistSpirit); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('Yes'); // DO counter

        expect(this.fluteMage.tokens.damage).toBe(this.mistSpirit.attack);
        expect(this.mistSpirit.location).toBe('archives');
        expect(this.fluteMage.exhausted).toBe(true);
    });

    it('simultaneous damage dealt from destroyed defender', function () {
        expect(this.fluteMage.tokens.damage).toBeUndefined();
        expect(this.ironWorker.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.ironWorker); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('Yes'); // DO counter

        expect(this.fluteMage.location).toBe('discard');
        expect(this.ironWorker.tokens.damage).toBe(this.fluteMage.attack);
        expect(this.ironWorker.exhausted).toBe(true);
    });

    it('defender may not counter when exhausted', function () {
        expect(this.fluteMage.tokens.damage).toBeUndefined();
        expect(this.blueJaguar.tokens.damage).toBeUndefined();
        this.fluteMage.exhaust();
        expect(this.fluteMage.exhausted).toBe(true);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.blueJaguar); // single attacker
        this.player1.clickPrompt('Done'); // no blue jag ability

        this.player2.clickPrompt('Done'); // no guard

        expect(this.fluteMage.tokens.damage).toBe(this.blueJaguar.attack);
        expect(this.blueJaguar.tokens.damage).toBeUndefined(); // no damage for attacker (no counter)
        expect(this.fluteMage.exhausted).toBe(true);
    });
});
