const Dice = require('../../../../server/game/dice');

describe('Blight ultimate', function () {
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
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: [],
                    spellboard: [],
                    threatZone: ['storm-bolt', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['bleed', 'bleed', 'bleed'],
                    deck: ['proliferate', 'rampage']
                }
            });
        });

        it('phase 1. attach bleed and add threat', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            this.player1.clickPrompt('Ok'); // ultimate

            // triggers effect for ult 1
            expect(this.blueJaguar.upgrades.length).toBe(1);

            expect(this.proliferate.location).toBe('play area');
            expect(this.proliferate.facedown).toBe(true);

            expect(this.player1).toHaveDefaultPrompt();
        });

        xit('phase 2 attach 2 bleed add 2 threat', function () {
            this.player2.player.chimeraPhase = 2;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');
            this.player1.clickPrompt('Ok'); // ultimate

            // triggers effect for ult 1
            expect(this.blueJaguar.upgrades.length).toBe(1);
            expect(this.mistSpirit.upgrades.length).toBe(1);

            expect(this.proliferate.location).toBe('play area');
            expect(this.proliferate.facedown).toBe(true);
            expect(this.rampage.location).toBe('play area');
            expect(this.rampage.facedown).toBe(true);

            expect(this.player1).toHaveDefaultPrompt();
        });

        xit('phase 3 removes a die from the game and stuns leftmost', function () {
            this.stormcall.tokens.status = 1;
            this.player1.dicepool[0].exhausted = true;
            this.player1.dicepool[1].exhausted = true;

            const diceCount = this.player1.dicepool.length;
            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.player.chimeraPhase).toBe(3);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok'); // ultimate
            // click die to remove - forces active if available
            this.player1.clickDie(0); // ignored
            expect(this.player1.dicepool.length).toBe(diceCount);

            this.player1.clickDie(2);
            expect(this.player1.dicepool.length).toBe(diceCount - 1);
            expect(this.blueJaguar.upgrades.length).toBe(1);
            expect(this.blueJaguar.exhausted).toBe(true);
        });
    });
});