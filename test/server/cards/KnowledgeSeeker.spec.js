describe('Seek 3 ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                hand: ['knowledge-seeker'],
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

    it('look at top 2 cards and place bottom or top', function () {
        // fix the deck
        this.player1.player.deck = [
            this.ironWorker,
            this.anchornaut,
            this.bloodArcher,
            this.purge,
            this.openMemories
        ];

        this.player1.play(this.knowledgeSeeker);
        this.player1.clickDie(0);
        this.player1.clickDone();
        expect(this.knowledgeSeeker.location).toBe('play area');

        this.player1.clickPrompt('anchornaut');
        this.player1.clickPrompt('bottom');
        this.player1.clickPrompt('iron worker');
        this.player1.clickPrompt('top');
        this.player1.clickPrompt('blood archer');
        this.player1.clickPrompt('bottom');

        expect(this.player1.deck.length).toBe(5);
        expect(this.player1.deck[4].id).toBe('blood-archer'); // blood archer on bottom
        expect(this.player1.deck[3].id).toBe('anchornaut'); // anchornaut on bottom
        expect(this.player1.deck[0].id).toBe('iron-worker'); // index 0 is the top
        expect(this.player1).toHaveDefaultPrompt();
    });
});
