describe('Summon Ash Spirit', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-ash-spirit'],
                    dicepool: ['charm', 'time', 'natural', 'natural'],
                    archives: ['ash-spirit']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: []
                }
            });
        });

        it('should place an ash spirit into play and have each player draw a card', function () {
            const p1DeckSize = this.player1.player.deck.length;
            const p2DeckSize = this.player2.player.deck.length;
            const p1HandSize = this.player1.player.hand.length;
            const p2HandSize = this.player2.player.hand.length;

            this.player1.clickCard(this.summonAshSpirit);
            this.player1.clickPrompt('Summon Ash Spirit');
            expect(this.ashSpirit.location).toBe('play area');

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2).toHavePrompt('Waiting for opponent');

            expect(this.player1.player.deck.length).toBe(p1DeckSize - 1);
            expect(this.player2.player.deck.length).toBe(p2DeckSize - 1);
            expect(this.player1.player.hand.length).toBe(p1HandSize + 1);
            expect(this.player2.player.hand.length).toBe(p2HandSize + 1);
        });

        it('should do nothing to a player if they have an empty deck', function () {
            this.player2.player.deck = [];
            const p1DeckSize = this.player1.player.deck.length;
            const p1HandSize = this.player1.player.hand.length;
            const p2HandSize = this.player2.player.hand.length;

            this.player1.clickCard(this.summonAshSpirit);
            this.player1.clickPrompt('Summon Ash Spirit');

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2).toHavePrompt('Waiting for opponent');

            expect(this.player1.player.deck.length).toBe(p1DeckSize - 1);
            expect(this.player2.player.deck.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(p1HandSize + 1);
            expect(this.player2.player.hand.length).toBe(p2HandSize);
        });
    });
    describe('when focused', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-ash-spirit', 'summon-ash-spirit'],
                    dicepool: ['charm', 'time', 'natural', 'natural'],
                    archives: ['ash-spirit']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: [],
                    hand: ['iron-worker', 'anchornaut']
                }
            });
        });

        it('empty opponent deck forces discard', function () {
            this.player2.player.deck = [];
            const p1DeckSize = this.player1.player.deck.length;
            const p1HandSize = this.player1.player.hand.length;

            this.player1.clickCard(this.summonAshSpirit);
            this.player1.clickPrompt('Summon Ash Spirit');

            expect(this.player1).toHavePrompt('Waiting for opponent');
            expect(this.player2).toHavePrompt('Choose a card to discard');

            this.player2.clickCard(this.ironWorker); // discard from hand

            expect(this.player1.player.deck.length).toBe(p1DeckSize - 1);
            expect(this.player2.player.deck.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(p1HandSize + 1);
            expect(this.player2.player.hand).toEqual([this.anchornaut]);

            expect(this.player2).toHavePrompt('Waiting for opponent');
        });

        it('empty summoner deck does not force discard', function () {
            this.player1.player.deck = [];
            const p1HandSize = this.player1.player.hand.length;

            this.player1.clickCard(this.summonAshSpirit);
            this.player1.clickPrompt('Summon Ash Spirit');

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2).toHavePrompt('Waiting for opponent');

            expect(this.player1.player.deck.length).toBe(0);
            expect(this.player1.player.hand.length).toBe(p1HandSize);
        });

        it('empty opponent hand skips prompt and goes straight to discard for opponent', function () {
            this.player2.player.deck = [];
            this.player2.player.hand = [];

            this.player1.clickCard(this.summonAshSpirit);
            this.player1.clickPrompt('Summon Ash Spirit');

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2).toHavePrompt('Waiting for opponent');

            this.player2.clickCard(this.ironWorker); // discard from hand

            expect(this.player2.player.deck.length).toBe(0);
            expect(this.player2.player.hand.length).toBe(0);
        });
    });
});
