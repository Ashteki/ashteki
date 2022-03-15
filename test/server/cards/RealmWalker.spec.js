describe('Realm Walker reaction', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['realm-walker', 'mist-spirit'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: ['butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight'],
                spellboard: ['summon-butterfly-monk', 'empower'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            }
        });

        this.fluteMage.tokens.exhaustion = 1;
    });

    it('prompts for exhaustion when realm walker is declared attacker', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.realmWalker); // single attacker
        this.player1.clickPrompt('Done'); // end attacker select

        // Realm Walker ability is automatic
        expect(this.player2).toBeAbleToSelect(this.hammerKnight);
        expect(this.player2).not.toBeAbleToSelect(this.fluteMage);
        this.player2.clickCard(this.hammerKnight); // click to exhaust

        expect(this.hammerKnight.exhausted).toBe(true);

        expect(this.coalRoarkwin.damage).toBe(3);
    });

    it("doesn't prompt for exhaustion when there are no unexhausted units", function () {
        this.hammerKnight.tokens.exhaustion = 1;

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.realmWalker); // single attacker
        this.player1.clickPrompt('Done'); // end attacker select

        // Realm Walker ability shouldn't trigger
        expect(this.coalRoarkwin.damage).toBe(3);
    });
});
