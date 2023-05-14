const Dice = require('../../../server/game/dice');

describe('When Attacked', function () {
    describe('an aspect will counter', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                    inPlay: ['rampage'],
                    threatZone: ['hunting-instincts'],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            // don't guard
            spyOn(Dice, 'd12Roll').and.returnValue(8);
        });

        it('attacker takes damage and aspect is not exhausted', function () {
            this.player1.clickAttack(this.rampage);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickPrompt('Ok'); // guard roll alert


            expect(this.rampage.location).toBe('play area');
            expect(this.rampage.damage).toBe(1);
            expect(this.fluteMage.location).toBe('discard');
            expect(this.rampage.exhausted).toBe(false);
        });

        it('when destroyed an aspect damages the chimera', function () {
            this.player1.clickAttack(this.rampage);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickPrompt('Ok'); // guard roll alert

            this.player1.clickDone(); // aftershock

            expect(this.rampage.location).toBe('discard');
            expect(this.virosS1.damage).toBe(1);
        });
    });

    describe('chimera guard', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                    inPlay: ['rampage'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(9);
        });

        it('chimera will guard on 9+', function () {
            this.player1.clickAttack(this.rampage);
            this.player1.clickCard(this.fluteMage);

            this.player1.clickPrompt('Ok'); // guard roll alert
            expect(this.rampage.location).toBe('play area');
            expect(this.rampage.damage).toBe(0);
            expect(this.virosS1.damage).toBe(1);
            expect(this.fluteMage.location).toBe('play area');
        });
    });

    describe('chimera guard and defenders', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                    inPlay: ['constrict'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(9);
        });

        it('chimera will not guard a defender', function () {
            this.player1.clickAttack(this.constrict);
            this.player1.clickCard(this.fluteMage);

            expect(this.constrict.location).toBe('play area');
            expect(this.constrict.damage).toBe(1);
            expect(this.virosS1.damage).toBe(0);
            expect(this.fluteMage.location).toBe('discard');
            expect(Dice.d12Roll).not.toHaveBeenCalled();

        });

        it('chimera will guard an exhausted defender', function () {
            this.constrict.tokens.exhaustion = 1;
            this.player1.clickAttack(this.constrict);
            this.player1.clickCard(this.fluteMage);

            this.player1.clickPrompt('Ok'); // guard roll alert
            expect(this.constrict.location).toBe('play area');
            expect(this.constrict.damage).toBe(0);
            expect(this.virosS1.damage).toBe(1);
            expect(this.fluteMage.location).toBe('play area');
            expect(Dice.d12Roll).toHaveBeenCalledTimes(1);
        });
    });

    describe('defender guard', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimates: ['viros-ultimate-1', 'viros-ultimate-2', 'viros-ultimate-3'],
                    inPlay: ['constrict', 'iron-scales'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(9);
        });

        it('defender will not guard a defender', function () {
            this.player1.clickAttack(this.constrict);
            this.player1.clickCard(this.fluteMage);

            expect(this.constrict.location).toBe('play area');
            expect(this.constrict.damage).toBe(1);
            expect(this.ironScales.damage).toBe(0);
            expect(this.fluteMage.location).toBe('discard');
            expect(Dice.d12Roll).not.toHaveBeenCalled();
        });

        it('defender will guard an exhausted defender', function () {
            this.constrict.tokens.exhaustion = 1;
            this.player1.clickAttack(this.constrict);
            this.player1.clickCard(this.fluteMage);

            this.player1.clickPrompt('Ok'); // guard roll alert
            expect(this.constrict.location).toBe('play area');
            expect(this.fluteMage.location).toBe('discard');
            expect(this.ironScales.damage).toBe(1);
            expect(this.virosS1.damage).toBe(0);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(0);
        });
    });
});
