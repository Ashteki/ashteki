describe('Unit attacks', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
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
    });
});
