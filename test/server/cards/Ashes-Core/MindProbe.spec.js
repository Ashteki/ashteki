describe('Mind Probe', function () {
    describe('Action Spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                    hand: ['mind-probe']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    dicepool: ['natural', 'natural'],
                    hand: ['choke'],
                    deck: ['anchornaut', 'hammer-knight', 'cover', 'close-combat', 'choke']
                }
            });
        });

        it('discard removes card with no damage', function () {
            let length = this.player2.deck.length;

            this.player1.clickCard(this.mindProbe);
            this.player1.clickPrompt('Play this action');

            this.player1.clickPrompt('anchornaut'); // purge
            // return
            this.player1.clickPrompt('hammer knight');
            this.player1.clickPrompt('cover');
            this.player1.clickPrompt('choke');
            // (implicit close-combat final return)

            expect(this.player2.deck.length).toBe(length - 1);
            expect(this.player2.deck[0].id).toBe('close-combat');
            expect(this.player2.deck[1].id).toBe('choke');
            expect(this.player2.deck[2].id).toBe('cover');
            expect(this.player2.deck[3].id).toBe('hammer-knight');

            // anchornaut is removed from play
            expect(this.player2.player.purged[0].id).toBe('anchornaut');
        });
    });
});
