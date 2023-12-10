const Dice = require('../../../server/game/dice');

describe('Frostwild Scourge Behaviour Rolls', function () {
    describe('Phase 1', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['regenerate'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['stun', 'vigor']
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

        it('5 Reveal then Attack with that aspect', function () {
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

        it('8 reveal, attach a Vigor to that aspect', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.regenerate.upgrades.length).toBe(1);
            expect(this.vigor.parent).toBe(this.regenerate);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('10 attach a stun to opp rightmost then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(10); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.fluteMage.upgrades.length).toBe(1);
            expect(this.stun.parent).toBe(this.fluteMage);
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
                    inPlay: ['anchornaut', 'flute-mage'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['regenerate'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['stun', 'vigor']
                }
            });
            this.player2.player.chimeraPhase = 2;
        });

        it('phase 2: 1, Reveal puts card into play', function () {
            // reveal
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            expect(this.rampage.facedown).toBe(false);
            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn(); // adds RR because of threat
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

        it('phase 2: 4 Reveal then Attack with that aspect', function () {
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

        it('phase 2: 6 reveal and attach vigor', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(6); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.regenerate.upgrades.length).toBe(1);
            expect(this.vigor.parent).toBe(this.regenerate);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('phase 2: 8 deal 1 damage to exhausted units and pb then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll
            this.anchornaut.tokens.exhaustion = 1;
            this.fluteMage.tokens.exhaustion = 1;
            this.coalRoarkwin.tokens.exhaustion = 1;

            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            this.player1.clickCard(this.coalRoarkwin);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickCard(this.anchornaut);
            expect(this.regenerate.facedown).toBe(false);
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.fluteMage.damage).toBe(1);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('phase 2: 8 no exhaustion no damage', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll

            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.fluteMage.damage).toBe(0);
            expect(this.anchornaut.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('phase 2: 10 attach a stun to opp rightmost then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(10); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.fluteMage.upgrades.length).toBe(1);
            expect(this.stun.parent).toBe(this.fluteMage);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('phase 2: 12 add red rains token then reveal', function () {
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
                    inPlay: ['anchornaut', 'flute-mage'],
                    spellboard: ['summon-light-bringer'],
                    dicepool: ['natural', 'natural', 'charm', 'divine', 'divine', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['light-bringer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['regenerate'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['stun', 'vigor']
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

        it('phase 3: 4 Reveal then Attack with that aspect', function () {
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

        it('phase 3: 6 reveal and attach vigor', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(6); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.regenerate.upgrades.length).toBe(1);
            expect(this.vigor.parent).toBe(this.regenerate);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('phase 3: 8 lower 2 dice', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll

            expect(this.regenerate.facedown).toBe(true);
            expect(this.player1.dicepool.filter((d) => d.level === 'power').length).toBe(6);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();

            expect(this.player1.dicepool.filter((d) => d.level === 'power').length).toBe(4);
            expect(this.regenerate.facedown).toBe(false);
            expect(this.coalRoarkwin.damage).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('phase 3: 8 lower 2 dice, but only 1 available', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll
            expect(this.regenerate.facedown).toBe(true);
            this.player1.dicepool.forEach((d) => (d.level = 'basic'));
            this.player1.dicepool[0].level = 'power';
            expect(this.player1.dicepool.filter((d) => d.level === 'power').length).toBe(1);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            this.player1.clickDie(0);
            this.player1.clickDone();

            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.player1.dicepool.filter((d) => d.level === 'power').length).toBe(0);
            expect(this.regenerate.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });


        it('phase 3: 10 attach a stun to opp rightmost then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(10); // set behaviour roll
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic

            expect(this.regenerate.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.regenerate.facedown).toBe(false);
            expect(this.fluteMage.upgrades.length).toBe(1);
            expect(this.stun.parent).toBe(this.fluteMage);
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
