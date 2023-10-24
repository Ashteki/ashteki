const Dice = require('../../../../server/game/dice');

describe('Scourge ultimate', function () {
    describe('Effects', function () {
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
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['stun', 'stun', 'stun']
                }
            });
        });

        it('phase 1', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            this.player1.clickPrompt('Ok'); // ultimate

            // triggers effect for ult 1
            expect(this.blueJaguar.location).toBe('archives');

            expect(this.aradelSummergaard.upgrades.length).toBe(1);
            expect(this.mistSpirit.upgrades.length).toBe(1);
            expect(this.aradelSummergaard.exhausted).toBe(true);
            expect(this.mistSpirit.exhausted).toBe(true);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('Viros phase 3 ultimate trigger no damage but adds aspect', function () {
            const aspectCount = this.player2.player.aspectsInPlay.length;
            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.player.chimeraPhase).toBe(3);

            this.player1.clickCard(this.summonBloodPuppet);
            this.player1.clickPrompt('Summon Blood Puppet');
            this.player1.clickPrompt("Opponent's");
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            this.player1.clickPrompt('Ok'); // ultimate

            // triggers effect for VIROS ULTIMATE 3
            expect(this.player2.player.aspectsInPlay.length).toBe(aspectCount + 1);

            // no damage
            expect(this.blueJaguar.damage).toBe(0);
            expect(this.mistSpirit.location).toBe('play area');
            expect(this.aradelSummergaard.damage).toBe(0);

            // no change to phase
            expect(this.player2.player.chimeraPhase).toBe(3);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
