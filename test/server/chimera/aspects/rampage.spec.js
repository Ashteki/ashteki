const Dice = require('../../../../server/game/dice');

describe('Rampage Aspect', function () {
    describe('Rampage Reveal', function () {
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
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['rampage', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);

        });

        it('puts card into play with 2 status', function () {
            expect(this.rampage.location).toBe('threatZone');
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.rampage.location).toBe('play area');
            expect(this.rampage.status).toBe(2);
        });
    });

    describe('Rampage In Play', function () {
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
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: ['rampage'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.rampage.tokens.status = 2;
            this.player2.dicepool.forEach(d => d.level = 'basic');
        });

        it('start of turn rerolls basic dice', function () {
            expect(this.rampage.location).toBe('play area');
            this.player1.endTurn();

            expect(this.rampage.status).toBe(1);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

        });

        it('status ability is inexhaustible', function () {
            this.rampage.tokens.exhaustion = 1;
            expect(this.rampage.location).toBe('play area');
            this.player1.endTurn();

            expect(this.rampage.status).toBe(1);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
        });
    });
});