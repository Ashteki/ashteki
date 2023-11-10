const Dice = require('../../../../server/game/dice');

describe('Charge Fist Aspect', function () {
    describe('On Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['charge-fist', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('puts card into play with 3 status', function () {
            expect(this.chargeFist.location).toBe('play area');
            expect(this.chargeFist.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.chargeFist.location).toBe('play area');
            expect(this.chargeFist.facedown).toBe(false);
            expect(this.chargeFist.status).toBe(3);
        });
    });

    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['charge-fist'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('start of turn rerolls all opponent non-basic dice', function () {
            this.chargeFist.tokens.status = 1;
            expect(this.player1.activeNonBasicDiceCount).toBe(6);
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.chargeFist.location).toBe('play area');
            this.player1.endTurn();

            expect(this.chargeFist.status).toBe(0);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.coalRoarkwin.damage).toBe(3);
            // all non-basic dice are rerolled
            expect(this.player1.activeNonBasicDiceCount).toBe(0);
        });

        it('does not trigger before last status', function () {
            this.chargeFist.tokens.status = 2;
            expect(this.player1.activeNonBasicDiceCount).toBe(6);
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.chargeFist.location).toBe('play area');
            this.player1.endTurn();

            expect(this.chargeFist.status).toBe(1);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.coalRoarkwin.damage).toBe(0);
            // all non-basic dice are rerolled
            expect(this.player1.activeNonBasicDiceCount).toBe(6);
            expect(this.chargeFist.status).toBe(1);
        });
    });
});
