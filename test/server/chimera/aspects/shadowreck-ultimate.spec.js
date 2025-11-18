const Dice = require('../../../../server/game/dice');

describe('Shadowreck ultimate', function () {
    describe('Effects', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit', 'flute-mage'],
                    dicepool: ['natural', 'natural', 'charm', 'ceremonial'],
                    spellboard: ['summon-blood-puppet'],
                    archives: ['blood-puppet'],
                    hand: ['purge', 'summon-gilder']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'spawn-of-shadowreck',
                    behaviour: 'shadowreck-behaviour',
                    ultimate: 'shadowreck-ultimate',
                    inPlay: ['stormcall'],
                    spellboard: [],
                    threatZone: ['storm-bolt', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['webbed', 'webbed', 'webbed', 'webbed'],
                    deck: ['rampage']
                }
            });
        });

        it('phase 1 - destroy leftmost and attach webbed to all units', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            // triggers effect for ult 1
            expect(this.blueJaguar.location).toBe('archives');

            expect(this.aradelSummergaard.upgrades.length).toBe(0);
            expect(this.mistSpirit.upgrades.length).toBe(1);
            expect(this.mistSpirit.anyEffect('webbed')).toBe(true);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 2 damage 3 to pb webbed to all units', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.player.chimeraPhase = 2;
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            // triggers effect for ult 2
            expect(this.blueJaguar.location).toBe('play area');

            expect(this.aradelSummergaard.upgrades.length).toBe(0);
            expect(this.aradelSummergaard.damage).toBe(3); // 3 from ult
            expect(this.mistSpirit.upgrades.length).toBe(1);
            expect(this.blueJaguar.upgrades.length).toBe(1);
            expect(this.mistSpirit.anyEffect('webbed')).toBe(true);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 3 forces 2 discard - hand', function () {
            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.player.chimeraPhase).toBe(3);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            this.player1.clickCard(this.summonGilder);
            this.player1.clickCard(this.purge);
            this.player1.clickDone();

            expect(this.summonGilder.location).toBe('discard');
            expect(this.purge.location).toBe('discard');
            expect(this.mistSpirit.upgrades.length).toBe(1);
            expect(this.mistSpirit.anyEffect('webbed')).toBe(true);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
