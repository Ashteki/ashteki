describe('Glow Finch', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blood-shaman'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                hand: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover'],
                deck: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['glow-finch', 'iron-worker'],
                hand: ['out-of-the-mist'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
            }
        });

        this.aradelSummergaard.tokens.damage = 1;
        this.player1.dicepool[0].lower();
    });

    it('adds a forces draw on destroyed', function () {
        let cardCount = this.player1.deck.length;
        this.player1.clickCard(this.moltenGold);
        this.player1.clickPrompt('Play this action');
        this.player1.clickCard(this.glowFinch);

        expect(this.player1.deck.length).toBe(cardCount - 2); // -1 for playing mg, -2 for glowFinch
    });
});
