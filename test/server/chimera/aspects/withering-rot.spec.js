const Dice = require('../../../../server/game/dice');

describe('Withering Rot', function () {
    describe('Ability In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['tsunami-shot', 'purge']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['withering-rot'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('the last status triggers - can discard from hand', function () {
            this.witheringRot.tokens.status = 1;
            expect(this.witheringRot.location).toBe('play area');
            this.player1.endTurn();
            this.player1.clickPrompt('Discard');
            this.player1.clickCard(this.purge); // chosen discard
            expect(this.witheringRot.location).toBe('play area');
            expect(this.witheringRot.status).toBe(0);
            expect(this.purge.location).toBe('discard');
            this.player1.clickOk();
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('the last status triggers - damage choice', function () {
            this.witheringRot.tokens.status = 1;
            expect(this.witheringRot.location).toBe('play area');
            this.player1.endTurn();
            this.player1.clickPrompt('1 Pb Damage');
            expect(this.witheringRot.location).toBe('play area');
            expect(this.witheringRot.status).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(1);
            this.player1.clickOk();
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('if status remains then nothing', function () {
            this.witheringRot.tokens.status = 2;
            expect(this.witheringRot.location).toBe('play area');
            this.player1.endTurn();
            this.player1.clickOk(); // rage / behaviour roll
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Ability In Play - no hand', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: []
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['withering-rot'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('the last status triggers - unable to discard damages', function () {
            this.witheringRot.tokens.status = 1;
            expect(this.witheringRot.location).toBe('play area');
            this.player1.endTurn();
            expect(this.player1).not.toHavePrompt('Discard');
            this.player1.clickPrompt('1 Pb Damage');
            expect(this.witheringRot.status).toBe(0);
            expect(this.coalRoarkwin.damage).toBe(1);
            this.player1.clickOk();
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
