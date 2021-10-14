describe('Multiple damage effects', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['glow-finch', 'mist-spirit'],
                dicepool: ['natural', 'divine', 'divine', 'charm'],
                hand: ['natures-wrath'],
                spellboard: ['chant-of-revenge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['butterfly-monk', 'gilder'],
                spellboard: []
            }
        });
    });

    it('damages all units in play', function () {
        let cardCount = this.player2.deck.length;

        this.player1.clickCard(this.naturesWrath);
        this.player1.clickPrompt('Play this action');

        expect(this.gilder.damage).toBe(1);

        expect(this.player1).toHavePrompt('Triggered Abilities');
        this.player1.clickCard(this.glowFinch);
        this.player1.clickYes(); // may prompt for last request 2

        expect(this.player2).toHavePrompt('Mend 1');
        this.player2.clickCard(this.gilder);
        expect(this.glowFinch.location).toBe('archives');
        expect(this.butterflyMonk.location).toBe('archives');
        expect(this.gilder.damage).toBe(0);

        expect(this.player2.deck.length).toBe(cardCount - 2); // -1 for actions, -1 for glowFinch
    });
});
