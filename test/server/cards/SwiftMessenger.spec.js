describe('Swift Messenger in hand', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk'],
                hand: ['beast-tamer'],
                dicepool: ['charm', 'charm']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'illusion', 'illusion', 'ceremonial', 'time'],
                hand: ['swift-messenger'],
                archives: ['sleeping-widow']
            }
        });

        this.player2.actions.main = false; // shouldn't need this
        this.fluteMage.tokens.damage = 1;
    });

    it('reaction to play after opponent unit enters play', function () {
        this.player1.play(this.beastTamer);

        expect(this.player2).toBeAbleToSelect(this.swiftMessenger);

        this.player2.clickCard(this.swiftMessenger);

        expect(this.swiftMessenger.location).toBe('play area');
        expect(this.player2.dicepool[5].exhausted).toBe(true);
        expect(this.player2.player.limitedPlayed).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('does not count as reaction when played normally', function () {
        this.player1.endTurn();
        this.player2.play(this.swiftMessenger);
        expect(this.swiftMessenger.location).toBe('play area');
        expect(this.player2.player.limitedPlayed).toBe(0);
        expect(this.player2).toHaveDefaultPrompt();
    });
});
