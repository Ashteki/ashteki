const Dice = require('../../../server/game/dice');

describe('Chimera dice interations', function () {
    describe('Chimera rolls fifth rage dice power side', function () {
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
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
            spyOn(Dice, 'd12Roll').and.returnValue(1);

            this.player2.dicepool[0].level = 'power';
            this.player2.dicepool[1].level = 'power';
            this.player2.dicepool[2].level = 'power';
            this.player2.dicepool[3].level = 'power';
            expect(this.huntingInstincts.facedown).toBe(true);
        });

        it('5 powers triggers red rains token', function () {
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(1);
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll

            expect(this.player2.dicepool.every(d => d.level === 'basic'));
            expect(this.player2.phoenixborn.redRains).toBe(1);
            this.player1.clickPrompt('Ok');

            expect(this.huntingInstincts.facedown).toBe(false);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
        });

    });

    describe('Illusion dice power vs rage dice', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['illusion', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player2.dicepool[0].level = 'power';
            this.player2.dicepool[1].level = 'power';
        });

        it('illusion power lowers power rage to basic', function () {
            expect(this.player2.dicepool[0].level).toBe('power');
            expect(this.player2.dicepool[1].level).toBe('power');

            this.player1.clickDie(0);
            this.player1.clickPrompt('Illusion Dice Power');
            this.player1.clickOpponentDie(0);
            // this.player1.clickOpponentDie(1);
            this.player1.clickDone();
            expect(this.player2.dicepool[0].level).toBe('basic');
            expect(this.player2.dicepool[1].level).toBe('power');

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
