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
                    inPlay: ['anchornaut'],
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
                    threatZone: ['hunting-instincts'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon'],
                    deck: ['rampage', 'whiplash', 'shockwave', 'storm-bolt', 'avalanche']
                }
            });
        });

        it('dragonborn cleans bf, gains status, replenish aspects', function () {
            // reveal
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic - Attack, if able. If not, Reveal 
            this.player1.endTurn();
            expect(this.scathaKalani.status).toBe(0); // no dragon phase addition
            this.player1.clickPrompt('Ok');
            expect(this.player1).toHaveDefaultPrompt();
            // fudge end of round
            this.huntingInstincts.tokens.exhaustion = 2; // prevent attack on Db turn
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

            this.player1.clickNo();
            expect(this.game.round).toBe(2);
            expect(this.bloodPuppet.location).toBe('archives');
            expect(this.scathaKalani.status).toBe(1); // dragon phase addition for aspects
            expect(this.player2.totalAspects).toBe(4);
            this.player1.clickOk();
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
