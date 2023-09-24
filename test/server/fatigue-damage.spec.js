describe('Fatigue damage', function () {
    describe('when first player is lower', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [
                        'blue-jaguar',
                        'mist-spirit'
                    ],
                    spellboard: [
                        'summon-butterfly-monk',
                        'abundance',
                        'summon-gilder',
                        'summon-iron-rhino'
                    ],
                    archives: ['gilder'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial']
                }
            });

            this.aradelSummergaard.tokens.damage = 14; // 2 left
            this.coalRoarkwin.tokens.damage = 12; // 3 left

            this.player1.player.deck = [];
            this.player2.player.deck = [];
            this.game.disableFatigue = false;
        });

        it('player 2 the winner', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone();
            this.player2.clickDone();
            expect(this.game.winner.name).toBe(this.player2.name);
            expect(this.coalRoarkwin.damage).toBe(14);
            expect(this.aradelSummergaard.damage).toBe(16);
        });
    });

    describe('when second player is lower', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: [
                        'summon-butterfly-monk',
                        'abundance',
                        'summon-gilder',
                        'summon-iron-rhino'
                    ],
                    archives: ['gilder'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial']
                }
            });

            this.aradelSummergaard.tokens.damage = 13; // 3 left
            this.coalRoarkwin.tokens.damage = 13; // 2 left

            this.player1.player.deck = [];
            this.player2.player.deck = [];
            this.game.disableFatigue = false;
        });

        it('player 1 is the winner', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            this.player1.clickDone();
            this.player2.clickDone();
            expect(this.game.winner.name).toBe(this.player1.name);
            expect(this.coalRoarkwin.damage).toBe(15);
            expect(this.aradelSummergaard.damage).toBe(14);
        });
    });
});
