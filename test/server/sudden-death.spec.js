describe('Sudden Death', function () {
    describe('Discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shadow-hound', 'mist-spirit'],
                    spellboard: ['hypnotize'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['call-upon-the-realms', 'molten-gold'],
                    deck: ['anchornaut', 'iron-worker', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino'],
                    deck: ['hammer-knight', 'iron-worker', 'iron-worker']
                }
            });
        });

        it('start of turn causes 2 discard', function () {
            expect(this.player1.deck.length).toBe(3);
            expect(this.player2.deck.length).toBe(3);
            this.game.suddenDeath = true; // fudge

            this.player1.endTurn();
            expect(this.player1.deck.length).toBe(3);
            expect(this.player2.deck.length).toBe(1);
            this.player2.player.actions.main = false;
            this.player2.endTurn();
            expect(this.player1.deck.length).toBe(1);
            expect(this.player2.deck.length).toBe(1);
        });
    });

    describe('damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shadow-hound', 'mist-spirit'],
                    spellboard: ['hypnotize'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['call-upon-the-realms', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                }
            });

            this.game.suddenDeath = true;
            this.player1.player.deck = [];
            this.player2.player.deck = [];
        });

        it('start of turn causes 2 damage on empty deck', function () {

            expect(this.player1.deck.length).toBe(0);
            expect(this.player2.deck.length).toBe(0);
            this.game.suddenDeath = true; // fudge

            expect(this.aradelSummergaard.damage).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(0);

            this.player1.endTurn();
            expect(this.coalRoarkwin.damage).toBe(2);


        });
    });

    describe('mixed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['shadow-hound', 'mist-spirit'],
                    spellboard: ['hypnotize'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['call-upon-the-realms', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino'],
                    deck: ['iron-worker']

                }
            });

            this.game.suddenDeath = true;
            this.player2.player.deck = [this.ironWorker];
        });

        it('start of turn causes 1 discard and 1 damage on partial deck', function () {

            expect(this.player2.deck.length).toBe(1);
            this.game.suddenDeath = true; // fudge

            expect(this.aradelSummergaard.damage).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(0);

            this.player1.endTurn();
            expect(this.player2.deck.length).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(1);
        });
    });

});