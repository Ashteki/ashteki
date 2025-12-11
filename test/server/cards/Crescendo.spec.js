const Dice = require('../../../server/game/dice');

describe('Crescendo', function () {
    describe('standard test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    dicepool: ['ceremonial', 'sympathy', 'charm', 'charm'],
                    hand: ['crescendo', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['iron-rhino', 'mist-spirit']
                }
            });
        });

        it('can deal damage on attackers declared', function () {
            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone();
            this.player1.clickCard(this.crescendo);
            this.player1.clickCard(this.moltenGold);

            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.ironRhino);

            expect(this.hammerKnight.damage).toBe(1);
            expect(this.ironRhino.damage).toBe(3);

            expect(this.crescendo.location).toBe('discard');
            expect(this.moltenGold.location).toBe('discard');
        });

        it('BUG: destroy target of unit attack and clear attack status', function () {
            this.player1.clickAttack(this.mistSpirit);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.crescendo); // play
            this.player1.clickCard(this.moltenGold); // discard

            this.player1.clickCard(this.hammerKnight); // 1 damage
            this.player1.clickCard(this.mistSpirit); // 3 damage

            expect(this.hammerKnight.damage).toBe(1);
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.hammerKnight.isAttacker).toBe(false);
            // attackers ALWAYS exhaust
            expect(this.hammerKnight.exhausted).toBe(true);

            expect(this.crescendo.location).toBe('discard');
            expect(this.moltenGold.location).toBe('discard');
        });
    });

    describe('Bug Report: discard crescendo', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    dicepool: ['ceremonial', 'sympathy', 'charm', 'charm'],
                    hand: ['crescendo', 'crescendo']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['iron-rhino']
                }
            });
        });

        it('2 crescendos', function () {
            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone();
            this.player1.clickCard(this.player1.hand[0]);
            this.player1.clickCard(this.player1.hand[1]);

            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.ironRhino);

            expect(this.hammerKnight.damage).toBe(1);
            expect(this.ironRhino.damage).toBe(3);

            expect(this.player1.discard.length).toBe(2);
        });

        it('cant discard self', function () {
            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone();
            this.player1.clickCard(this.player1.hand[0]);
            this.player1.clickCard(this.player1.hand[0]);
            expect(this.player1).toHavePrompt('choose a card to discard');

            this.player1.clickCard(this.player1.hand[1]);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.ironRhino);

            expect(this.hammerKnight.damage).toBe(1);
            expect(this.ironRhino.damage).toBe(3);

            expect(this.player1.discard.length).toBe(2);
        });
    });

    describe('BUG vs Chimera: when unit attack target is destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'hammer-knight'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['ice-trap', 'crescendo', 'molten-gold']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: ['glare', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
        });

        it('destroy target of unit attack and clear attack status', function () {
            this.player1.clickAttack(this.rampage);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.crescendo); // play
            this.player1.clickCard(this.moltenGold); // discard

            this.player1.clickCard(this.hammerKnight); // 1 damage
            this.player1.clickCard(this.rampage); // 3 damage

            expect(this.hammerKnight.damage).toBe(1);
            expect(this.rampage.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.hammerKnight.isAttacker).toBe(false);
            // attackers ALWAYS exhaust
            expect(this.hammerKnight.exhausted).toBe(true);

            expect(this.crescendo.location).toBe('discard');
            expect(this.moltenGold.location).toBe('discard');
        });
    });

});
