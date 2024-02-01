const Dice = require('../../../../server/game/dice');

describe('Allure Aspect', function () {
    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino'],
                    deck: ['summon-gilder', 'flute-mage']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: ['allure'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            spyOn(Dice, 'getRandomInt').and.returnValue(5); // basic

            this.allure.tokens.status = 2;
        });

        it('start of turn forces draw then discard top of deck', function () {
            const deckLength = this.player1.deck.length;
            expect(this.allure.status).toBe(2);
            expect(this.allure.location).toBe('play area');
            this.player1.endTurn();

            expect(this.allure.status).toBe(1);
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1.deck.length).toBe(deckLength - 2); // one drawn, one discarded
            expect(this.player1.discard.length).toBe(1);
        });

        it('on empty deck just loses status', function () {
            this.player1.player.deck = [];
            expect(this.allure.status).toBe(2);
            expect(this.player1.deck.length).toBe(0);
            expect(this.allure.location).toBe('play area');
            this.player1.endTurn();

            expect(this.allure.status).toBe(1);
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1.discard.length).toBe(0);
        });
    });
});
