const Dice = require('../../../../server/game/dice');

describe('Shore Breaker Aspect', function () {
    describe('In Play - on attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['shore-breaker'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['rampage'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['drowning', 'drowning', 'drowning', 'drowning']
                }
            });

        });

        it('attach 2 drowning cards when destroys attacking', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack, else reveal
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.ironWorker.location).toBe('discard');
            expect(this.coalRoarkwin.drowningLevel).toBe(2);

            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });

    describe(' on attack, cannot attach 2 drowning', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['shore-breaker'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['rampage'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['drowning']
                }
            });

        });

        it('attach 1 drowning cards and deal 1 damage', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(3);  // attack, else reveal
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            this.player1.clickDone(); // guard
            this.player1.clickYes(); // counter
            expect(this.ironWorker.location).toBe('discard');
            expect(this.coalRoarkwin.drowningLevel).toBe(1);
            expect(this.coalRoarkwin.damage).toBe(1);

            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });
});