const Dice = require('../../../../server/game/dice');

describe('Moon Cove ultimate', function () {
    describe('Effects', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit', 'hammer-knight'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial'],
                    spellboard: ['summon-blood-puppet'],
                    archives: ['blood-puppet'],
                    hand: ['purge', 'summon-gilder']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'flood-of-moon-cove',
                    behaviour: 'moon-cove-behaviour',
                    ultimate: 'moon-cove-ultimate',
                    inPlay: ['stormcall'],
                    spellboard: [],
                    threatZone: ['storm-bolt', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['drowning', 'drowning', 'drowning', 'drowning'],
                    deck: ['rampage', 'undertow']
                }
            });
        });

        it('phase 1 - destroy leftmost and attach 2 drowning to pb', function () {
            expect(this.aradelSummergaard.drowningLevel).toBe(0);

            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            // triggers effect for ult 1
            expect(this.blueJaguar.location).toBe('archives');

            expect(this.aradelSummergaard.upgrades.length).toBe(2);
            expect(this.mistSpirit.upgrades.length).toBe(0);
            expect(this.aradelSummergaard.drowningLevel).toBe(2);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 2: 2 damage to all units, attach 2 drowning', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.player.chimeraPhase = 2;
            expect(this.aradelSummergaard.drowningLevel).toBe(0);
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.blueJaguar);

            // triggers effect for ult
            expect(this.blueJaguar.location).toBe('archives');
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.hammerKnight.damage).toBe(2);

            expect(this.aradelSummergaard.drowningLevel).toBe(2);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 3: deal 1 to pb and add an aspect', function () {
            const aspectCount = this.player2.player.aspectsInPlay.length;

            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.player.chimeraPhase).toBe(3);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            expect(this.player2.player.aspectsInPlay.length).toBe(aspectCount + 1);

            expect(this.aradelSummergaard.damage).toBe(1);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
