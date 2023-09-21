const Dice = require("../../../server/game/dice");

describe('Hunters Mark', function () {
    describe('Hunters Mark Ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'harold-westraven',
                    inPlay: ['mist-spirit'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    archives: ['hunters-mark']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'hammer-knight'],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                    hand: ['explosive-growth', 'explosive-growth']
                }
            });
        });

        it('modifies card attack', function () {
            this.player1.clickCard(this.haroldWestraven);

            this.player1.clickPrompt('Mark Prey');
            this.player1.clickCard(this.ironWorker);
            expect(this.huntersMark.parent).toBe(this.ironWorker);

            this.player1.player.actions.side = 1;
            this.haroldWestraven.tokens.exhaustion = 0;

            expect(this.haroldWestraven.exhausted).toBe(false);
            this.player1.clickCard(this.haroldWestraven);
            this.player1.clickPrompt('Mark Prey');
            this.player1.clickCard(this.hammerKnight);
            expect(this.huntersMark.parent).toBe(this.ironWorker);
            expect(this.huntersMark.parent).toBe(this.ironWorker);
        });
    });

    describe('guard restriction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'harold-westraven',
                    inPlay: ['mist-spirit'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    archives: ['hunters-mark']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'hammer-knight'],
                    dicepool: ['natural', 'natural', 'sympathy', 'sympathy'],
                    hand: ['explosive-growth', 'explosive-growth']
                }
            });
        });

        it('prevents guard by pb', function () {
            expect(this.ironWorker.location).toBe('play area');
            this.player1.clickCard(this.haroldWestraven);

            this.player1.clickPrompt('Mark Prey');
            this.player1.clickCard(this.ironWorker);
            expect(this.huntersMark.parent).toBe(this.ironWorker);
            this.player1.clickAttack(this.ironWorker);
            this.player1.clickCard(this.mistSpirit);
            expect(this.player2).toHavePrompt('Do you want to counter?');
            this.player2.clickNo();
            expect(this.ironWorker.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('guard restriction vs chimera', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                allowSetup: true,
                player1: {
                    phoenixborn: 'harold-westraven',
                    inPlay: ['ice-golem', 'three-eyed-owl', 'mist-spirit'],
                    spellboard: ['summon-three-eyed-owl'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    archives: ['ice-golem', 'hunters-mark']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['rampage'],
                    spellboard: [],
                    threatZone: ['whiplash', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(9);
        });

        it('prevents guard by chimera', function () {
            expect(this.rampage.location).toBe('play area');
            this.player1.clickCard(this.haroldWestraven);

            this.player1.clickPrompt('Mark Prey');
            this.player1.clickCard(this.rampage);
            expect(this.huntersMark.parent).toBe(this.rampage);
            this.player1.clickAttack(this.rampage);
            this.player1.clickCard(this.mistSpirit);

            expect(this.rampage.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
