const Dice = require('../../../server/game/dice');

describe('Corpse of Viros Behaviour Rolls', function () {
    describe('rampage in play', function () {
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
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

        });

        it('1, Reveal puts card into play', function () {
            // reveal
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            expect(this.huntingInstincts.location).toBe('threatZone');
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.huntingInstincts.location).toBe('play area');
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('3 Attacks if able, no reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(3); // set behaviour roll
            expect(this.huntingInstincts.location).toBe('threatZone');
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.rampage.isAttacker).toBe(true);
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.huntingInstincts.location).toBe('threatZone');
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('3 Cannot Attack, Reveals', function () {
            this.rampage.tokens.exhaustion = 1; // cannot attack
            spyOn(Dice, 'd12Roll').and.returnValue(3); // set behaviour roll
            expect(this.huntingInstincts.location).toBe('threatZone');
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.huntingInstincts.location).toBe('play area');
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });


        it('5 Reveal then Attack with that aspect', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(5); // set behaviour roll
            expect(this.huntingInstincts.location).toBe('threatZone');

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.huntingInstincts.location).toBe('play area');
            expect(this.huntingInstincts.isAttacker).toBe(true);
            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('8 lower dice then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(8); // set behaviour roll

            expect(this.huntingInstincts.location).toBe('threatZone');
            expect(this.player1.dicepool.filter(d => d.level === 'power').length).toBe(6);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();

            expect(this.player1.dicepool.filter(d => d.level === 'power').length).toBe(4);
            expect(this.huntingInstincts.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('10 raise a die then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(10); // set behaviour roll
            this.player2.dicepool.forEach(d => d.level = 'basic');

            expect(this.huntingInstincts.location).toBe('threatZone');
            expect(this.player2.dicepool.filter(d => d.level === 'power').length).toBe(0);

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            // >= because could be 1 or 2 (rageroll plus behaviour roll)
            expect(this.player2.dicepool.filter(d => d.level === 'power').length).toBeGreaterThanOrEqual(1);
            expect(this.huntingInstincts.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

        it('12 add red rains token then reveal', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            expect(this.huntingInstincts.location).toBe('threatZone');

            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.player2.phoenixborn.redRains).toBe(1);
            expect(this.huntingInstincts.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });

    });
});
