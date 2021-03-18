describe('Shadow Guard', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                dicepool: [
                    'natural',
                    'natural',
                    'illusion',
                    'illusion',
                    'ceremonial',
                    'ceremonial'
                ],
                hand: ['shadow-guard', 'summon-sleeping-widows'],
                archives: ['sleeping-widow']
            }
        });

        this.player2.actions.main = false; // shouldn't need this
        this.fluteMage.tokens.damage = 1;
    });

    it('unit attack', function () {
        expect(this.fluteMage.damage).toBe(1);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.mistSpirit); // single attacker

        expect(this.player2).toHavePrompt('Any Reactions?');
        expect(this.player2).toBeAbleToSelect(this.shadowGuard);
        expect(this.mistSpirit.location).toBe('play area'); // not killed yet

        this.player2.clickCard(this.shadowGuard);

        expect(this.shadowGuard.location).toBe('play area');
        expect(this.player2.dicepool[2].exhausted).toBe(true);
        expect(this.player2.dicepool[3].exhausted).toBe(true);

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('Yes'); // to counter
        expect(this.mistSpirit.location).toBe('archives');
        expect(this.shadowGuard.location).toBe('play area');

        expect(this.player2.player.limitedPlayed).toBe(1);
        expect(this.player2).toHavePrompt('Waiting for opponent'); // SG counts as a reaction
    });

    it('does not count as reaction when played normally', function () {
        this.player1.endTurn();
        this.player2.play(this.shadowGuard);
        expect(this.shadowGuard.location).toBe('play area');
        expect(this.player2.player.limitedPlayed).toBe(0);
    });
});
