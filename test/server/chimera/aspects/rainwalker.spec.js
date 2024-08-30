const Dice = require('../../../../server/game/dice');

describe('Rainwalker', function () {
    describe('horde attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'tsunami-shot']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['rainwalker', 'rainwalker', 'rainwalker'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['rainwalker']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player2.dicepool.forEach((d) => {
                d.level = 'basic';
            });
        });

        it('collects all horde attackers in attack', function () {
            this.player1.endTurn();
            expect(this.player2.player.unitsInPlay.length).toBe(3);
            // Attack
            expect(this.game.attackState).not.toBeNull();
            expect(this.game.attackState.battles.length).toBe(3);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.rainwalker);
            this.player1.clickDone();

            expect(this.ironWorker.location).toBe('play area');
            expect(this.ironWorker.damage).toBe(1);
            expect(this.ironWorker.exhausted).toBe(false);
        });
    });

    describe('Ephemeral', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'tsunami-shot']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['rainwalker'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['rainwalker']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player2.dicepool.forEach((d) => {
                d.level = 'basic';
            });
        });

        it('destroyed on exhaust (attack without defender)', function () {
            this.player1.endTurn();
            // Attack PB
            expect(this.coalRoarkwin.damage).toBe(1);
            expect(this.rainwalker.location).toBe('archives');
            expect(this.corpseOfViros.damage).toBe(0);
        });
    });
});
