describe('Forwarn ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['emberoot-lizard', 'iron-worker'],
                spellboard: ['summon-omen-bringer'],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: [],
                archives: ['omen-bringer']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage'],
                deck: ['anchornaut', 'iron-worker', 'blood-archer']
            }
        });
    });

    it('look at top 2 cards and place bottom or top', function () {
        // fix the deck
        this.player2.player.deck = [this.ironWorker, this.anchornaut, this.bloodArcher];

        this.player1.clickCard(this.summonOmenBringer);
        this.player1.clickPrompt('Summon Omen Bringer');
        this.player1.clickDie(0);
        this.player1.clickDone();
        expect(this.omenBringer.location).toBe('play area');

        this.player1.clickPrompt('anchornaut');
        this.player1.clickPrompt('bottom');
        this.player1.clickPrompt('iron worker');
        this.player1.clickPrompt('top');

        expect(this.player2.deck.length).toBe(3);
        expect(this.player2.deck[2].id).toBe('anchornaut'); // anchornaut on bottom
        expect(this.player2.deck[0].id).toBe('iron-worker'); // index 0 is the top
        expect(this.player1).toHaveDefaultPrompt();
    });
});
