describe('Flash Strike', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['time', 'natural', 'illusion'],
                hand: ['flash-strike']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                hand: ['summon-sleeping-widows'],
                archives: ['sleeping-widow']
            }
        });

        this.ironWorker.tokens.status = 1;
    });

    it('reaction on guard choice - unit attack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.mistSpirit); // single attacker
        this.player2.clickDone(); // no guard

        this.player1.clickCard(this.flashStrike);
        this.player1.clickCard(this.mistSpirit);

        expect(this.player1.dicepool[0].exhausted).toBe(true);

        expect(this.mistSpirit.location).toBe('play area');
        expect(this.mistSpirit.exhausted).toBe(true);
        expect(this.fluteMage.location).toBe('discard');

        expect(this.player1).toHaveDefaultPrompt();
    });
});
