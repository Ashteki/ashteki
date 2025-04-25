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
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
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
            expect(this.corpseOfViros.damage).toBe(1);
        });
    });

    describe('chimera guard', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage', 'hammer-knight', 'winged-lioness'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
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
            expect(this.corpseOfViros.damage).toBe(1);
            expect(this.fluteMage.location).toBe('play area');
        });

        it('cannot guard against stalk', function () {
            this.player1.clickAttack(this.rampage);
            this.player1.clickCard(this.wingedLioness);

            expect(this.rampage.location).toBe('discard');
            expect(this.corpseOfViros.damage).toBe(1);
            expect(this.wingedLioness.location).toBe('archives');
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
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
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
            expect(this.corpseOfViros.damage).toBe(0);
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
            expect(this.corpseOfViros.damage).toBe(1);
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
                    inPlay: ['anchornaut', 'flute-mage', 'hammer-knight', 'archasaurus-mount'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['constrict', 'iron-scales', 'blood-puppet', 'rampage'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('defender will not guard a defender', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(9);

            this.player1.clickAttack(this.constrict);
            this.player1.clickCard(this.fluteMage);

            expect(this.constrict.location).toBe('play area');
            expect(this.constrict.damage).toBe(1);
            expect(this.ironScales.damage).toBe(0);
            expect(this.fluteMage.location).toBe('discard');
            expect(Dice.d12Roll).not.toHaveBeenCalled();
        });

        it('defender will guard an aspect', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(9);

            this.player1.clickAttack(this.rampage);
            this.player1.clickCard(this.fluteMage);
            expect(this.player1).toHavePrompt('Aspect Guard');
            this.player1.clickPrompt('Ok');
            expect(this.rampage.location).toBe('play area');
            expect(this.rampage.damage).toBe(0);
            expect(this.constrict.damage).toBe(1);
            expect(this.fluteMage.location).toBe('discard');
            expect(Dice.d12Roll).not.toHaveBeenCalled();
        });

        it('defender cannot guard vs gigantic 2', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1); // no chimera guard

            this.constrict.tokens.exhaustion = 1; // could defend as life = 4

            this.player1.clickAttack(this.rampage);
            this.player1.clickCard(this.archasaurusMount);
            expect(this.player1).toHavePrompt('Chimera guard roll');
            this.player1.clickPrompt('Ok');
            expect(this.rampage.location).toBe('discard');
            expect(this.constrict.damage).toBe(0);
            expect(this.ironScales.damage).toBe(0);
            expect(this.archasaurusMount.location).toBe('play area');
        });

        it('defender will not guard non-aspect', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(9);

            this.player1.clickAttack(this.bloodPuppet);
            this.player1.clickCard(this.fluteMage);

            expect(this.bloodPuppet.location).toBe('play area');
            expect(this.bloodPuppet.damage).toBe(1);
            expect(this.ironScales.damage).toBe(0);
            expect(this.fluteMage.location).toBe('play area');
            expect(Dice.d12Roll).not.toHaveBeenCalled();
        });

        it('defender will guard an exhausted defender', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(9);

            this.constrict.tokens.exhaustion = 1;
            this.player1.clickAttack(this.constrict);
            this.player1.clickCard(this.fluteMage);

            this.player1.clickPrompt('Ok'); // guard roll alert
            expect(this.constrict.location).toBe('play area');
            expect(this.fluteMage.location).toBe('discard');
            expect(this.ironScales.damage).toBe(1);
            expect(this.corpseOfViros.damage).toBe(0);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(0);
        });

        it('defender will block for pb', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(9);

            this.constrict.tokens.exhaustion = 1; // setup iron scales to defend
            this.player1.clickAttack(this.corpseOfViros);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickDone();

            expect(this.ironScales.damage).toBe(1);
            expect(this.fluteMage.location).toBe('discard');
            expect(this.corpseOfViros.damage).toBe(0);
            expect(Dice.d12Roll).toHaveBeenCalledTimes(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('foreced block of threatening', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['grave-knight', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['frozen-fear', 'iron-scales', 'blood-puppet'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('chimera will use non-defenders to block if no defenders', function () {
            this.ironScales.tokens.exhaustion = 1;
            this.player1.clickAttack(this.corpseOfViros);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickCard(this.graveKnight);
            this.player1.clickDone();

            // resolve battles
            this.player1.clickCard(this.graveKnight);
            this.player1.clickCard(this.fluteMage);

            expect(this.frozenFear.location).toBe('discard'); // blocked vs grave knight
            expect(this.graveKnight.location).toBe('discard');
            expect(this.corpseOfViros.damage).toBe(4); // GK overkill 1 + 2 blood + fluteMage 1
        });

        it('chimera will use defender to block threatening unit as a priority', function () {
            this.player1.clickAttack(this.corpseOfViros);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickCard(this.graveKnight);
            this.player1.clickDone();

            expect(this.game.attackState.getBattleFor(this.graveKnight).guard).toBe(
                this.ironScales
            );
            expect(this.game.attackState.getBattleFor(this.fluteMage).guard).toBe(null);
            // resolve battles
            this.player1.clickCard(this.graveKnight);
            this.player1.clickCard(this.fluteMage);

            expect(this.ironScales.damage).toBe(1); // blocked vs grave knight, takes 1
            expect(this.graveKnight.location).toBe('discard'); // killed by iron scales
            expect(this.corpseOfViros.damage).toBe(1); // fluteMage 1
        });

        it('bug: chimera should not block with exhausted unit', function () {
            this.ironScales.exhaust();
            this.bloodPuppet.exhaust();
            this.frozenFear.exhaust();

            this.player1.clickAttack(this.corpseOfViros);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickCard(this.graveKnight);
            this.player1.clickDone();

            expect(this.game.attackState.getBattleFor(this.graveKnight).guard).toBe(null);
            expect(this.game.attackState.getBattleFor(this.fluteMage).guard).toBe(null);
            // resolve battles
            this.player1.clickCard(this.graveKnight);
            this.player1.clickCard(this.fluteMage);

            expect(this.ironScales.damage).toBe(0);
            expect(this.graveKnight.location).toBe('play area');
            expect(this.corpseOfViros.damage).toBe(5);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
