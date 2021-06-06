describe('Mind Probe', function () {
    describe('with 5 cards', function () {
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

        it('purge and rearrange as expected', function () {
            let length = this.player2.deck.length;

            this.player1.clickCard(this.mindProbe);
            this.player1.clickPrompt('Play this action');

            this.player1.clickPrompt('anchornaut'); // purge
            // return
            this.player1.clickPrompt('hammer knight');
            this.player1.clickPrompt('cover');
            this.player1.clickPrompt('choke');
            this.player1.clickPrompt('close combat');

            expect(this.player2.deck.length).toBe(length - 1);
            expect(this.player2.deck[0].id).toBe('close-combat');
            expect(this.player2.deck[1].id).toBe('choke');
            expect(this.player2.deck[2].id).toBe('cover');
            expect(this.player2.deck[3].id).toBe('hammer-knight');

            // anchornaut is removed from play
            expect(this.player2.player.purged[0].id).toBe('anchornaut');
        });
    });

    describe('with 3 cards', function () {
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
                    deck: ['anchornaut', 'hammer-knight', 'cover']
                }
            });

            // remove fillers
            this.player2.removeFillerCards();
        });

        it('purge and rearrange as expected', function () {
            let length = this.player2.deck.length;
            expect(length).toBe(3);

            this.player1.clickCard(this.mindProbe);
            this.player1.clickPrompt('Play this action');
            this.player1.clickPrompt('anchornaut'); // purge
            // return
            this.player1.clickPrompt('hammer knight');
            this.player1.clickPrompt('cover');

            expect(this.player2.deck.length).toBe(length - 1);
            expect(this.player2.deck[0].id).toBe('cover');
            expect(this.player2.deck[1].id).toBe('hammer-knight');

            // anchornaut is removed from play
            expect(this.player2.player.purged[0].id).toBe('anchornaut');
        });
    });

    describe('with 1 card in deck', function () {
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
                    deck: ['anchornaut']
                }
            });

            // remove fillers
            this.player2.removeFillerCards();
        });

        it('purge and rearrange as expected', function () {
            let length = this.player2.deck.length;
            expect(length).toBe(1);

            this.player1.clickCard(this.mindProbe);
            this.player1.clickPrompt('Play this action');
            this.player1.clickPrompt('anchornaut'); // purge
            // no cards to return

            expect(this.player2.deck.length).toBe(length - 1);
            // anchornaut is removed from play
            expect(this.player2.player.purged[0].id).toBe('anchornaut');

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

});
