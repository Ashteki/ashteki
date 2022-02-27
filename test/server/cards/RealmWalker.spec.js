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

    it('prompts for reaction when realm walker is declared attacker', function () {
        expect(this.fluteMage.exhausted).toBe(true);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.realmWalker); // single attacker
        this.player1.clickPrompt('Done'); // end attacker select

        expect(this.player1).toBeAbleToSelect(this.realmWalker);
        this.player1.clickCard(this.realmWalker); // activate Realm Walker ability

        expect(this.player2).toBeAbleToSelect(this.hammerKnight);
        expect(this.player2).not.toBeAbleToSelect(this.fluteMage);
        // any interrupts?
        this.player2.clickCard(this.hammerKnight); // click to exhaust

        expect(this.hammerKnight.exhausted).toBe(true);
        // expect(this.player2).toHavePrompt('Choose a blocker'); // carry on with attack sequence
        expect(this.coalRoarkwin.damage).toBe(3);
    });
});
