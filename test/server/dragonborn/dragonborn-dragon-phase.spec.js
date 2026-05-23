const Dice = require('../../../server/game/dice');

describe('Dragonborn dragon phase', function () {
    describe('On first round', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
        });

        it('dragon phase is skipped - no status token', function () {
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic - Attack, if able. If not, Reveal 
            expect(this.huntingInstincts.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll

            expect(this.player2.phoenixborn.status).toBe(0); // no dragon phase addition
            this.player1.clickPrompt('Ok');

            expect(this.huntingInstincts.facedown).toBe(false); // reveal
            // expect(Dice.getRandomInt).toHaveBeenCalledTimes(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('On second round', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    spellboard: ['summon-blood-puppet'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'ceremonial', 'sympathy'],
                    hand: ['summon-iron-rhino'],
                    archives: ['blood-puppet']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    inPlay: [],
                    spellboard: [],
                    threatZone: ['rampage'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon'],
                    deck: ['rampage', 'whiplash', 'shockwave', 'storm-bolt', 'avalanche', 'storm-bolt', 'avalanche']
                }
            });
        });

        it('dragonborn cleans bf, gains status, replenish aspects, trigger progress spell', function () {
            expect(this.player2.player.chimeraPhase).toBe(1);

            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic - Attack, if able. If not, Reveal 
            this.player1.endTurn();
            expect(this.scathaKalani.status).toBe(0); // no dragon phase addition
            this.player1.clickPrompt('Ok');
            expect(this.player1).toHaveDefaultPrompt();
            // fudge end of round
            this.rampage.tokens.exhaustion = 2; // prevent attack on Db turn
            this.rampage.tokens.status = 0; // prevent status activity on Db turn
            this.player1.clickCard(this.summonBloodPuppet);
            this.player1.clickPrompt('Summon Blood Puppet');
            this.player1.clickPrompt("Opponent's");
            // fudge for end of round
            expect(this.bloodPuppet.location).toBe('play area');
            expect(this.player2.threatZone.length).toBe(0);
            this.bloodPuppet.exhaust();
            this.player1.player.actions.main = true;
            this.player1.endTurn();
            this.player1.clickDone();
            expect(this.scathaKalani.status).toBe(1); // dragon phase addition for aspects
            expect(this.rampage.status).toBe(2);
            // trigger progress ready spell
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.hammerKnight);
            expect(this.anchornaut.location).toBe('discard');
            expect(this.hammerKnight.damage).toBe(1);
            this.player1.clickNo();
            expect(this.game.round).toBe(2);
            expect(this.bloodPuppet.location).toBe('archives');
            expect(this.player2.totalAspects).toBe(4);

            this.player1.clickOk();
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.player.chimeraPhase).toBe(2);
        });

        it('phase 2', function () {
            this.player2.player.chimeraPhase = 2;
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic - Attack, if able. If not, Reveal 
            this.player1.endTurn();
            this.player1.clickPrompt('Ok');
            expect(this.player1).toHaveDefaultPrompt();
            // fudge end of round
            this.rampage.tokens.exhaustion = 2; // prevent attack on Db turn
            this.rampage.tokens.status = 0; // prevent status activity on Db turn
            // fudge for end of round
            this.player1.player.actions.main = true;
            this.player1.endTurn();
            this.player1.clickDone();

            // progress spell ability
            expect(this.hammerKnight.damage).toBe(3);
            expect(this.player2.threatZone.length).toBe(3);

            this.player1.clickNo();

            this.player1.clickOk();
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.player.chimeraPhase).toBe(3);
        });

        it('phase 3', function () {
            this.player2.player.chimeraPhase = 3;
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic - Attack, if able. If not, Reveal 
            this.player1.endTurn();
            this.player1.clickPrompt('Ok');
            expect(this.player1).toHaveDefaultPrompt();
            // fudge end of round
            this.rampage.tokens.exhaustion = 2; // prevent attack on Db turn
            this.rampage.tokens.status = 0; // prevent status activity on Db turn
            // fudge for end of round
            this.player1.player.actions.main = true;
            this.player1.endTurn();
            this.player1.clickDone();

            // progress spell ability
            expect(this.hammerKnight.damage).toBe(3);
            expect(this.player2.inPlay.length).toBe(1);
            expect(this.player2.threatZone.length).toBe(4);

            this.player1.clickNo();

            this.player1.clickOk();
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player2.player.chimeraPhase).toBe(3);
        });
    });
});
