const Dice = require('../../../../server/game/dice');

describe('Glare Aspect', function () {
    describe('On reveal', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['ice-trap', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['glare', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);

        });

        it('prevents ice trap', function () {
            expect(this.glare.location).toBe('play area');
            expect(this.glare.facedown).toBe(true);
            this.player1.endTurn();
            // informs real player of behaviour roll
            expect(this.player2).toHavePrompt('Alerting opponent');
            this.player1.clickPrompt('Ok');

            expect(this.glare.location).toBe('play area');
            expect(this.glare.facedown).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['molten-gold', 'summon-iron-rhino', 'iron-worker']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['glare'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('prevents action spells', function () {
            expect(this.player1).toHaveDefaultPrompt();
            // expect(this.player1).not.toBeAbleToSelect(this.moltenGold);
            this.player1.clickCard(this.moltenGold);
            expect(this.player1).toHaveDefaultPrompt();
            // expect(this.player1).toBeAbleToSelect(this.summonIronRhino);
            this.player1.clickCard(this.summonIronRhino);
            expect(this.player1).not.toHaveDefaultPrompt();
        });
    });
});