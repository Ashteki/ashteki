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
                    spellboard: ['summon-blood-puppet', 'summon-admonisher'],
                    archives: ['blood-puppet'],
                    hand: ['purge', 'summon-gilder'],
                    deck: ['anchornaut', 'hammer-knight', 'rose-fire-dancer']
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
            const aspectCount = this.player2.player.aspectsInPlay.length;

            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            // triggers effect for ult 1
            expect(this.blueJaguar.upgrades.length).toBe(1);

            expect(this.proliferate.location).toBe('play area');
            expect(this.proliferate.facedown).toBe(true);
            expect(this.player2.player.aspectsInPlay.length).toBe(aspectCount + 1);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 2 attach 2 bleed to rightmost add 1 threat', function () {
            this.player2.player.chimeraPhase = 2;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            const aspectCount = this.player2.player.aspectsInPlay.length;
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.phoenixborn.redRains).toBe(2);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            // triggers effect for ult 1
            expect(this.fluteMage.upgrades.length).toBe(1);
            expect(this.mistSpirit.upgrades.length).toBe(1);

            expect(this.proliferate.location).toBe('play area');
            expect(this.proliferate.facedown).toBe(true);
            expect(this.player2.player.aspectsInPlay.length).toBe(aspectCount + 1);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('phase 3 forces discard - hand', function () {
            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            const aspectCount = this.player2.player.aspectsInPlay.length;
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.player.chimeraPhase).toBe(3);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            this.player1.clickCard(this.summonGilder);
            expect(this.player2.player.aspectsInPlay.length).toBe(aspectCount + 1);

            expect(this.summonGilder.location).toBe('discard');
        });

        it('phase 3 forces discard - spellboard', function () {
            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.player.chimeraPhase).toBe(3);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            this.player1.clickCard(this.summonAdmonisher);

            expect(this.summonAdmonisher.location).toBe('discard');
        });

        it('phase 3 forces discard - top of deck', function () {
            const topCard = this.player1.deck[0];
            const drawCount = this.player1.deck.length;
            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll
            this.player2.phoenixborn.tokens.redRains = 2;
            expect(this.player2.player.chimeraPhase).toBe(3);

            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            this.player1.clickPrompt('Top of Deck');
            expect(topCard.location).toBe('discard');
            expect(this.player1.deck.length).toBe(drawCount - 1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
