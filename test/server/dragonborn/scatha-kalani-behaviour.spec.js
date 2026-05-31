const Dice = require('../../../server/game/dice');

describe('Dragonborn Dice rolls', function () {
    describe('Dragonborn rolls fifth dragon dice power side', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino', 'purge', 'abundance']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
        });

        it('basic roll, attacks if able ', function () {
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll

            expect(this.player2.dicepool.every((d) => d.level === 'basic'));
            expect(this.player2.phoenixborn.status).toBe(0);
            this.player1.clickPrompt('Ok');

            expect(this.huntingInstincts.facedown).toBe(true);
            expect(this.rampage.isAttacker).toBe(true);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
        });

        it('basic roll, unable to attack reveals ', function () {
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            this.rampage.exhaust();
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            expect(this.player2.phoenixborn.status).toBe(0);
            // informs real player of behaviour roll
            this.player1.clickPrompt('Ok');

            expect(this.huntingInstincts.facedown).toBe(false);
            expect(this.rampage.isAttacker).toBe(false);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
        });

        it('power roll, reveal and attack with that aspect ', function () {
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(0); // basic
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll

            expect(this.player2.dicepool.every((d) => d.level === 'basic')).toBeFalse();
            expect(this.player2.phoenixborn.status).toBe(0);
            this.player1.clickPrompt('Ok');

            expect(this.huntingInstincts.isAttacker).toBe(true);
            expect(this.rampage.isAttacker).toBe(false);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
        });

        it('class roll, phase 1. lower 1 opponent die, attack ', function () {
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(1); // class
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll

            expect(this.player2.dicepool.every((d) => d.level === 'basic')).toBeFalse();
            expect(this.player2.phoenixborn.status).toBe(0);
            this.player1.clickPrompt('Ok');
            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].level).toBe('class');
            expect(this.huntingInstincts.facedown).toBe(false);
            expect(this.rampage.isAttacker).toBe(false);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
        });

        it('class roll, phase 2. deal damage - pb, attack ', function () {
            this.player2.player.chimeraPhase = 2;
            spyOn(Dice, 'getRandomInt').and.returnValue(1); // class
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll

            expect(this.player2.dicepool.every((d) => d.level === 'basic')).toBeFalse();
            expect(this.player2.phoenixborn.status).toBe(0);
            this.player1.clickPrompt('Ok');
            this.player1.clickCard(this.coalRoarkwin);
            expect(this.huntingInstincts.facedown).toBe(false);
            expect(this.coalRoarkwin.damage).toBe(1);

            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
        });

        it('class roll, phase 2. deal damage - unit, attack ', function () {
            this.player2.player.chimeraPhase = 2;
            spyOn(Dice, 'getRandomInt').and.returnValue(1); // class
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll

            expect(this.player2.dicepool.every((d) => d.level === 'basic')).toBeFalse();
            expect(this.player2.phoenixborn.status).toBe(0);
            this.player1.clickPrompt('Ok');
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
            this.player1.clickCard(this.hammerKnight);
            expect(this.huntingInstincts.facedown).toBe(false);
            expect(this.hammerKnight.damage).toBe(1);

            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
        });

        it('class roll, phase 3. mill one - top of deck, attack ', function () {
            this.player2.player.chimeraPhase = 3;
            spyOn(Dice, 'getRandomInt').and.returnValue(1); // class
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll

            expect(this.player2.dicepool.every((d) => d.level === 'basic')).toBeFalse();
            expect(this.player2.phoenixborn.status).toBe(0);
            this.player1.clickPrompt('Ok');
            this.player1.clickPrompt('Discard');
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
            expect(this.player1).toBeAbleToSelect(this.purge);
            this.player1.clickPrompt('Top of deck');
            expect(this.huntingInstincts.facedown).toBe(false);
            expect(this.player1.discard.length).toBe(1);
            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
        });

        it('class roll when ready spell exhausted, removes exhaustion token no effect ', function () {
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(1); // class
            this.scathaUltimate.tokens.exhaustion = 1;
            expect(this.scathaUltimate.exhausted).toBe(true);
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            this.player1.clickOk();
            expect(this.scathaUltimate.exhausted).toBe(false);

            expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
