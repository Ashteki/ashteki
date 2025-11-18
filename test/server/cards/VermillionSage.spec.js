describe('Study 1 ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                hand: ['vermillion-sage', 'knowledge-seeker'],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                deck: ['anchornaut', 'iron-worker', 'blood-archer', 'purge', 'open-memories']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage']
            }
        });
    });

    it('look at top 1 cards and place bottom or top', function () {
        // fix the deck
        this.player1.player.deck = [
            this.ironWorker,
            this.anchornaut,
            this.bloodArcher,
            this.purge,
            this.openMemories
        ];

        this.player1.play(this.vermillionSage);
        expect(this.vermillionSage.location).toBe('play area');

        this.player1.clickPrompt('bottom');

        expect(this.player1.deck.length).toBe(4);
        expect(this.anchornaut.location).toBe('hand');
        expect(this.player1.deck[0].id).toBe('blood-archer'); // blood archer on top
        expect(this.player1.deck[3].id).toBe('iron-worker'); // iron worker on bottom
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('with empty deck', function () {
        // fix the deck
        this.player1.player.deck = [];

        expect(this.player1.deck.length).toBe(0);
        this.player1.play(this.vermillionSage);

        expect(this.vermillionSage.location).toBe('play area');
        expect(this.player1.deck.length).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
