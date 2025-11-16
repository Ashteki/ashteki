const Dice = require('../../../../server/game/dice');

describe('Lordswall ultimate', function () {
    describe('Effects', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit', 'flute-mage'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial'],
                    spellboard: ['summon-blood-puppet', 'summon-admonisher'],
                    archives: ['blood-puppet'],
                    hand: ['purge', 'summon-gilder'],
                    deck: ['anchornaut', 'hammer-knight', 'rose-fire-dancer']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'siege-of-lordswall',
                    behaviour: 'lordswall-behaviour',
                    ultimate: 'lordswall-ultimate',
                    inPlay: [],
                    spellboard: [],
                    threatZone: ['storm-bolt', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    deck: ['proliferate', 'rampage'],
                    archives: ['rainwalker', 'rainwalker', 'rainwalker']
                }
            });
        });

        it('phase 1. 1 damage to all opp units and place 2 walkers', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            const aspectCount = this.player2.player.aspectsInPlay.length;

            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            this.player1.clickCard(this.blueJaguar);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.fluteMage);
            // damage
            expect(this.blueJaguar.damage).toBe(1);
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.fluteMage.damage).toBe(1);

            expect(this.player2.player.aspectsInPlay.length).toBe(aspectCount + 2);
            expect(this.rainwalker.location).toBe('play area');

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 2. 2 damage to all opp units and place 2 walkers', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.player.chimeraPhase = 2;

            this.player2.phoenixborn.tokens.redRains = 2;
            const aspectCount = this.player2.player.aspectsInPlay.length;

            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            this.player1.clickCard(this.blueJaguar);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.fluteMage);
            // damage
            expect(this.blueJaguar.location).toBe('archives');
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.fluteMage.location).toBe('discard');

            expect(this.player2.player.aspectsInPlay.length).toBe(aspectCount + 2);
            expect(this.rainwalker.location).toBe('play area');

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 3 places 3 rainwalkers', function () {
            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            const aspectCount = this.player2.player.aspectsInPlay.length;
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.player.chimeraPhase).toBe(3);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            expect(this.player2.player.aspectsInPlay.length).toBe(aspectCount + 3);

        });
    });
});
