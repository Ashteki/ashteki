const Dice = require('../../../../server/game/dice');

describe('Scourge ultimate', function () {
    describe('Effects', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit', 'flute-mage'],
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
                    threatZone: ['storm-bolt', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['stun', 'stun', 'stun', 'stun']
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

        it('phase 1, stun on stun test', function () {
            // reveal storm bolt
            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.stormBolt.facedown).toBe(false);
            expect(this.fluteMage.upgrades.length).toBe(1);

            jasmine.createSpy().and.returnValue(12); // set behaviour roll
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
            expect(this.fluteMage.upgrades.length).toBe(1);
            expect(this.aradelSummergaard.exhausted).toBe(true);
            expect(this.mistSpirit.exhausted).toBe(true);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 2', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.player.chimeraPhase = 2;
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            this.player1.clickPrompt('Ok'); // ultimate

            // triggers effect for ult 2
            expect(this.blueJaguar.location).toBe('play area');

            expect(this.aradelSummergaard.upgrades.length).toBe(1);
            expect(this.aradelSummergaard.damage).toBe(3);
            expect(this.mistSpirit.upgrades.length).toBe(1);
            expect(this.aradelSummergaard.exhausted).toBe(true);
            expect(this.mistSpirit.exhausted).toBe(true);
            expect(this.blueJaguar.upgrades.length).toBe(1);
            expect(this.blueJaguar.exhausted).toBe(true);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 3 removes a die from the game and stuns leftmost', function () {
            const diceCount = this.player1.dicepool.length;
            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.player.chimeraPhase).toBe(3);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok'); // ultimate
            this.player1.clickDie(0);

            expect(this.player1.dicepool.length).toBe(diceCount - 1);
            expect(this.blueJaguar.upgrades.length).toBe(1);
            expect(this.blueJaguar.exhausted).toBe(true);
        });
    });
});
