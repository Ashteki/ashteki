const Dice = require('../../../server/game/dice');

describe('Chimera ultimate', function () {
    describe('value and exhaustion', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial'],
                    spellboard: ['summon-blood-puppet'],
                    archives: ['blood-puppet']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('ultimate value raises with exhaustion tokens', function () {
            expect(this.virosS1.ultimate).toBe(3);

            this.virosS1.tokens.exhaustion = 2;

            expect(this.virosS1.ultimate).toBe(5);
        });

        it('red rains ultimate trigger removes RR tokens, removes non-owned units', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.clickCard(this.summonBloodPuppet);
            this.player1.clickPrompt('Summon Blood Puppet');
            this.player1.clickPrompt("Opponent's");
            expect(this.bloodPuppet.location).toBe('play area');
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            this.player1.clickPrompt('Ok'); // ultimate

            expect(this.player2.phoenixborn.redRains).toBe(0);
            expect(this.bloodPuppet.location).toBe('archives');
        });
    });
});
