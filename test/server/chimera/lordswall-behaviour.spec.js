const Dice = require('../../../server/game/dice');

describe('Siege of Lordswall Behaviour Rolls', function () {
    describe('Phase 1', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'siege-of-lordswall',
                    behaviour: 'lordswall-behaviour',
                    ultimate: 'lordswall-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['regenerate'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['rainwalker', 'rainwalker']
                }
            });
        });

        it('1, Reveal puts card into play', function () {
            // reveal
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            expect(this.rampage.facedown).toBe(false);
            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('3 Attacks if able, no reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(3); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.rampage.isAttacker).toBe(true);
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.regenerate.facedown).toBe(true);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('3 Cannot Attack, Reveals', function () {
            this.rampage.tokens.exhaustion = 1; // cannot attack
            spyOn(Dice, 'd12Roll').and.returnValue(3); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('5 Reveal then Attack with rightmost aspect', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(5); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.regenerate.isAttacker).toBe(true);
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('7 reroll rage dice then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(7); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(0); // power

            expect(this.regenerate.facedown).toBe(true);
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(0);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(3); // one normal roll, plus 2 rerolls
            expect(this.regenerate.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('10 summon a rainwalker', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(10); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.rainwalker.location).toBe('play area');
            expect(this.rainwalker.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('12 add red rains token then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.player2.phoenixborn.redRains).toBe(1);
            expect(this.regenerate.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });

    describe('phase 2', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'siege-of-lordswall',
                    behaviour: 'lordswall-behaviour',
                    ultimate: 'lordswall-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['regenerate'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['rainwalker', 'rainwalker']
                }
            });
            this.player2.player.chimeraPhase = 2;
        });

        it('phase 2: 1, Reveal puts card into play', function () {
            // reveal
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            expect(this.rampage.facedown).toBe(false);
            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('phase 2: 2 Attacks if able, no reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(2); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.rampage.isAttacker).toBe(true);
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.regenerate.facedown).toBe(true);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('5 Reveal then Attack with rightmost aspect', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(5); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.regenerate.isAttacker).toBe(true);
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('7 place 1 wound on Pb or rightmost unit', function () {
            expect(false).toBe(true);
            spyOn(Dice, 'd12Roll').and.returnValue(7); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(0); // power

            expect(this.regenerate.facedown).toBe(true);
            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(0);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.player2.dicepool.filter((d) => d.level === 'power').length).toBe(3); // one normal roll, plus 2 rerolls
            expect(this.regenerate.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('10 summon a rainwalker', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(10); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.rainwalker.location).toBe('play area');
            expect(this.rainwalker.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('12 add red rains token then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.player2.phoenixborn.redRains).toBe(1);
            expect(this.regenerate.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });

    describe('phase 3', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'anchornaut'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'siege-of-lordswall',
                    behaviour: 'lordswall-behaviour',
                    ultimate: 'lordswall-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['regenerate'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['rainwalker', 'rainwalker']
                }
            });
            this.player2.player.chimeraPhase = 3;
        });

        it('phase 3: 1 Attacks if able, no reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.rampage.isAttacker).toBe(true);
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.regenerate.facedown).toBe(true);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('phase 3: 4 Reveal then Attack with rightmost aspect', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(4); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.regenerate.isAttacker).toBe(true);
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('phase 3: 7-11 summon a rainwalker', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(10); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.rainwalker.location).toBe('play area');
            expect(this.rainwalker.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('phase 3: 12 add red rains token then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.player2.phoenixborn.redRains).toBe(1);
            expect(this.regenerate.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });
});
