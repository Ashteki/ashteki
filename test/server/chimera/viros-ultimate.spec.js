const Dice = require('../../../server/game/dice');

describe('Viros ultimate', function () {
    describe('value and exhaustion', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial', 'illusion'],
                    spellboard: ['summon-blood-puppet'],
                    archives: ['blood-puppet'],
                    hand: ['fade-away']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['iron-scales'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('ultimate value raises with exhaustion tokens', function () {
            expect(this.player2.player.ultimateThreshold).toBe(3);

            this.corpseOfViros.tokens.exhaustion = 2;
            expect(this.player2.player.ultimateThreshold).toBe(5);

            this.player2.ultimate.tokens.exhaustion = 2;
            expect(this.player2.player.ultimateThreshold).toBe(7);
        });

        it('red rains ultimate trigger removes RR tokens, removes non-owned units, next phase', function () {
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

            // removes RR tokens
            expect(this.player2.phoenixborn.redRains).toBe(0);
            // wipes alien units
            expect(this.bloodPuppet.location).toBe('archives');

            // triggers effect for VIROS ULTIMATE 1
            this.player1.clickCard(this.blueJaguar);
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickCard(this.mistSpirit);
            expect(this.blueJaguar.damage).toBe(1);
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.aradelSummergaard.damage).toBe(1);

            // advances phase
            expect(this.player2.player.chimeraPhase).toBe(2);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('ultimate removes non-owned upgrade', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.play(this.fadeAway, this.ironScales);
            expect(this.ironScales.upgrades.length).toBe(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            expect(this.ironScales.upgrades.length).toBe(0);

            // triggers effect for VIROS ULTIMATE 1
            this.player1.clickCard(this.blueJaguar);
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickCard(this.mistSpirit);
            expect(this.blueJaguar.damage).toBe(1);
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.aradelSummergaard.damage).toBe(1);

            // advances phase
            expect(this.player2.player.chimeraPhase).toBe(2);
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
