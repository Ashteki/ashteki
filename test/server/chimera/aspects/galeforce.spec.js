const { Level } = require('../../../../server/constants');
const Dice = require('../../../../server/game/dice');

describe('Galeforce Aspect', function () {
    describe('Rampage Reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['galeforce', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('puts card into play with 3 status', function () {
            expect(this.galeforce.location).toBe('play area');
            expect(this.galeforce.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.galeforce.location).toBe('play area');
            expect(this.galeforce.facedown).toBe(false);
            expect(this.galeforce.status).toBe(3);
        });
    });

    describe('galeforce In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: ['galeforce'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.galeforce.tokens.status = 3;
        });

        it('start of turn forces dice lower', function () {
            expect(this.player1.dicepool[0].level).toBe('power');
            expect(this.galeforce.location).toBe('play area');
            this.player1.endTurn();

            expect(this.galeforce.status).toBe(2);

            this.player1.clickDie(0);

            expect(this.player1.dicepool[0].level).toBe('class');
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
        });

        it('status galeforce is inexhaustible', function () {
            this.galeforce.tokens.exhaustion = 1;
            expect(this.galeforce.location).toBe('play area');
            this.player1.endTurn();

            this.player1.clickDie(0);

            expect(this.galeforce.status).toBe(2);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
        });

        it('with no dice to lower, status is still lost', function () {
            this.player1.dicepool.forEach((d) => {
                d.level = Level.Basic;
            });
            expect(this.player1.dicepool[0].level).toBe('basic');

            expect(this.galeforce.location).toBe('play area');
            this.player1.endTurn();

            expect(this.galeforce.status).toBe(2);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});