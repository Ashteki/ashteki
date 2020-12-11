describe('Attack on Phoenixborn', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'iron-worker']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'iron-worker']
            }
        });
    });

    it('blocker automatic counters', function () {
        expect(this.fluteMage.tokens.damage).toBeUndefined();
        expect(this.mistSpirit.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.mistSpirit); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.fluteMage.tokens.damage).toBe(1);
        expect(this.mistSpirit.tokens.damage).toBeUndefined();
    });

    it('defender may choose not to block', function () {
        expect(this.coalRoarkwin.tokens.damage).toBeUndefined();
        expect(this.ironWorker.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.ironWorker); // single attacker
        this.player1.clickPrompt('Done'); // end attacker choice

        this.player2.clickPrompt('Done'); // no blockers

        // damage to pb
        expect(this.coalRoarkwin.tokens.damage).toBe(2);
        // no damage to attacker
        expect(this.ironWorker.tokens.damage).toBeUndefined();
    });

    it('defender may choose to block with auto counter', function () {
        expect(this.coalRoarkwin.tokens.damage).toBeUndefined();
        expect(this.ironWorker.tokens.damage).toBeUndefined();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.ironWorker); // single attacker
        this.player1.clickPrompt('Done'); // end attacker choice

        this.player2.clickCard(this.fluteMage); // blocker
        expect(this.player2).toBeAbleToSelect(this.ironWorker);
        this.player2.clickCard(this.ironWorker); // who to block
        this.player2.clickPrompt('Done'); // for blockers

        // damage to pb
        expect(this.coalRoarkwin.tokens.damage).toBeUndefined();
        // counter damage to attacker
        expect(this.ironWorker.tokens.damage).toBe(1);
        expect(this.fluteMage.location).toBe('discard');
    });
});
