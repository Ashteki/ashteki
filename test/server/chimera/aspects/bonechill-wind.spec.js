const Dice = require('../../../../server/game/dice');

describe('Bonechill wind Aspect', function () {
    describe('Bonechill wind Reveal', function () {
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
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['bonechill-wind', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('puts card into play with 2 status', function () {
            expect(this.bonechillWind.location).toBe('play area');
            expect(this.bonechillWind.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.bonechillWind.location).toBe('play area');
            expect(this.bonechillWind.facedown).toBe(false);
            expect(this.bonechillWind.status).toBe(2);
        });
    });

    describe('Bonechill Wind In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: ['bonechill-wind'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.bonechillWind.tokens.status = 2;
        });

        it('start of turn deals damage to exhausted pb and units', function () {
            this.coalRoarkwin.tokens.exhaustion = 1;
            this.ironWorker.tokens.exhaustion = 1;
            expect(this.anchornaut.exhausted).toBe(false);
            expect(this.bonechillWind.location).toBe('play area');
            this.player1.endTurn();

            expect(this.bonechillWind.status).toBe(1);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.ironWorker.damage).toBe(1);
            expect(this.anchornaut.location).toBe('play area');
        });

        it('start of turn does not damage unexhausted pb', function () {
            expect(this.bonechillWind.location).toBe('play area');
            this.player1.endTurn();

            expect(this.bonechillWind.status).toBe(1);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.ironWorker.damage).toBe(0);
            expect(this.anchornaut.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('start of turn does not damage unexhausted pb with exhausted unit', function () {
            this.ironWorker.tokens.exhaustion = 1;
            expect(this.bonechillWind.location).toBe('play area');
            this.player1.endTurn();

            expect(this.bonechillWind.status).toBe(1);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.ironWorker.damage).toBe(1);
            expect(this.anchornaut.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('status ability is inexhaustible', function () {
            this.bonechillWind.tokens.exhaustion = 1;
            expect(this.bonechillWind.location).toBe('play area');
            this.player1.endTurn();

            expect(this.bonechillWind.status).toBe(1);
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');
        });
    });
});
