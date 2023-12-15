describe('Hypnotize', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker', 'flute-mage'],
                spellboard: ['hypnotize'],
                dicepool: ['charm', 'charm', 'illusion'],
                hand: ['reflections-in-the-water']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight', 'gilder'],
                spellboard: []
            }
        });
    });

    it('unit cannot be guarded', function () {
        this.player1.clickCard(this.hypnotize);
        this.player1.clickPrompt('Hypnotize a unit');
        this.player1.clickCard(this.fluteMage);

        this.player1.clickAttack(this.hammerKnight);
        this.player1.clickCard(this.fluteMage);

        // no guard prompt
        this.player2.clickNo(); // counter

        expect(this.hammerKnight.damage).toBe(1);
        this.player1.endTurn();

        expect(this.fluteMage.effects.length).toBe(0);
    });

    it('unit cannot be blocked', function () {
        expect(this.fluteMage.effects.length).toBe(0);
        this.player1.clickCard(this.hypnotize);
        this.player1.clickPrompt('Hypnotize a unit');
        this.player1.clickCard(this.fluteMage);

        this.player1.clickAttack(this.coalRoarkwin);
        this.player1.clickCard(this.fluteMage);
        this.player1.clickDone();

        // no block prompt
        expect(this.coalRoarkwin.damage).toBe(1);
        this.player1.endTurn();

        expect(this.fluteMage.effects.length).toBe(0);
    });
});
