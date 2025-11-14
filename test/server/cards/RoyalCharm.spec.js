const Dice = require("../../../server/game/dice");

describe('Royal Charm', function () {
    describe('on dice spent', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['mist-spirit', 'enchanted-violinist', 'rayward-recruit', 'meteor'],
                    spellboard: ['royal-charm', 'piercing-light'],
                    dicepool: ['divine', 'natural', 'charm', 'charm', 'divine'],
                    archives: ['butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'holy-knight'],
                    spellboard: []
                }
            });
            this.player1.dicepool[3].level = 'class';
        });

        it('use dice on card', function () {
            this.player1.play(this.enchantedViolinist);
            // unselect class die
            this.player1.clickDie(3);
            // select power die
            this.player1.clickDie(2);
            // choose die for royal charm
            this.player1.clickDie(2);

            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.royalCharm.hasModifiedAttack()).toBe(false);
            this.player1.clickCard(this.royalCharm);
            this.player1.clickPrompt('Use Die');
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.dieUpgrades.length).toBe(1);
            expect(this.hammerKnight.attack).toBe(2);
        });

        it('use dice on card targetting holy knight', function () {
            this.player1.play(this.enchantedViolinist);
            // unselect class die
            this.player1.clickDie(3);
            // select power die
            this.player1.clickDie(2);
            // choose die for royal charm
            this.player1.clickDie(2);

            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.royalCharm.hasModifiedAttack()).toBe(false);
            this.player1.clickCard(this.royalCharm);
            this.player1.clickPrompt('Use Die');
            this.player1.clickCard(this.holyKnight);
            expect(this.holyKnight.dieUpgrades.length).toBe(1);
            expect(this.holyKnight.attack).toBe(2);
        });

        it('allows overspend of charm dice for enchanted violinist', function () {
            this.player1.play(this.enchantedViolinist);
            // unselect class die
            this.player1.clickDie(3);
            // select power die
            this.player1.clickDie(2);
            // choose die for royal charm
            this.player1.clickDie(2);
            // check spellboard is still just 1
            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.player1.dicepool.length).toBe(4);
        });

        it('when playing meteor with one lion', function () {
            this.player1.play(this.meteor);
            // choose die for royal charm
            this.player1.clickDone();
            this.player1.clickDie(0);
            // check spellboard is still just 1
            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.player1.dicepool.length).toBe(4);
            expect(this.player1).toHavePromptTitle('Meteor'); // choose AoE order
        });

        it('hosted dice clicks should trigger card ability not dice power', function () {
            this.player1.play(this.enchantedViolinist);
            // unselect class die
            this.player1.clickDie(3);
            // select power die
            this.player1.clickDie(2);
            // choose die for royal charm
            this.player1.clickDie(2);

            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.royalCharm.hasModifiedAttack()).toBe(false);

            this.player1.clickDieUpgrade(this.royalCharm, 0);
            this.player1.clickPrompt('Use Die');
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.dieUpgrades.length).toBe(1);
            expect(this.hammerKnight.attack).toBe(2);
        });

        it('piercing light does not effect RC with divine die', function () {
            this.player1.play(this.raywardRecruit);
            this.player1.clickDie(0);
            this.player1.clickDone(); // choose dice
            // RC select
            this.player1.clickDie(0);

            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.royalCharm.hasModifiedAttack()).toBe(false);
            expect(this.royalCharm.hasKeyword('overkill')).toBe(false);

            this.player1.clickDieUpgrade(this.royalCharm, 0);
            this.player1.clickPrompt('Use Die');
            this.player1.clickCard(this.raywardRecruit);
            expect(this.raywardRecruit.dieUpgrades.length).toBe(1);
            expect(this.raywardRecruit.attack).toBe(1);
        });
    });

    describe('on dice spent with 2 royal charm', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['mist-spirit', 'enchanted-violinist', 'rayward-recruit', 'meteor'],
                    spellboard: ['royal-charm', 'royal-charm', 'piercing-light'],
                    dicepool: ['divine', 'natural', 'charm', 'charm', 'divine'],
                    archives: ['butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'holy-knight'],
                    spellboard: []
                }
            });
            this.player1.dicepool[3].level = 'class';
        });

        it('when playing meteor with 2 lions', function () {
            this.player1.play(this.meteor);
            // choose die for royal charm
            this.player1.clickDone();
            this.player1.clickDie(0);
            this.player1.clickDie(3);
            // check spellboard is still just 1
            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.player1.dicepool.length).toBe(3);
            expect(this.player1).toHavePromptTitle('Meteor'); // choose AoE order
        });
    });

    describe('vs Chimera: on dice spent with 2 royal charm', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['mist-spirit', 'enchanted-violinist', 'rayward-recruit', 'meteor'],
                    spellboard: ['royal-charm', 'royal-charm', 'piercing-light'],
                    dicepool: ['divine', 'natural', 'charm', 'charm', 'divine'],
                    archives: ['butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: [
                        'photosynthesize',
                        'photosynthesize',
                        'allure',
                        'sowing-strike',
                        'allure'
                    ],
                    deck: ['rampage'],
                    threatZone: ['ballistic-seeds', 'regenerate'],
                    dicepool: ['basic', 'basic', 'basic', 'basic', 'basic'],
                    archives: ['scarlet-seed']
                }
            });
        });

        it('when playing meteor with 0 lions', function () {
            this.player1.dicepool[0].level = 'class';
            this.player1.dicepool[4].level = 'class';
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll to 1 pb damage

            this.player1.endTurn();
            this.player1.clickOk();
            expect(this.ballisticSeeds.facedown).toBe(false);
            expect(this.scarletSeed.location).toBe('play area');
            this.player1.play(this.meteor);
            this.player1.clickDone();
            // choose die for royal charm
            // this.player1.clickDie(4);
            // this.player1.clickDone();
            // check spellboard is still just 1
            expect(this.royalCharm.dieUpgrades.length).toBe(0);
            expect(this.player1.dicepool.length).toBe(5);
            expect(this.player1).toHavePromptTitle('Meteor'); // choose AoE order
        });

        it('when playing meteor with 1 lions', function () {
            this.player1.dicepool[0].level = 'class';
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll to 1 pb damage

            this.player1.endTurn();
            this.player1.clickOk();
            expect(this.ballisticSeeds.facedown).toBe(false);
            expect(this.scarletSeed.location).toBe('play area');
            this.player1.play(this.meteor);
            // choose die for royal charm
            this.player1.clickDone();
            this.player1.clickDie(4);
            // this.player1.clickDone();
            // check spellboard is still just 1
            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.player1.dicepool.length).toBe(4);
            expect(this.player1).toHavePromptTitle('Meteor'); // choose AoE order
        });

        it('when playing meteor with 2 lions', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(12); // set behaviour roll to 1 pb damage

            this.player1.endTurn();
            this.player1.clickOk();
            expect(this.ballisticSeeds.facedown).toBe(false);
            expect(this.scarletSeed.location).toBe('play area');
            this.player1.play(this.meteor);
            // choose die for royal charm
            this.player1.clickDone();
            this.player1.clickDie(0);
            this.player1.clickDie(3);
            // check spellboard is still just 1
            expect(this.royalCharm.dieUpgrades.length).toBe(1);
            expect(this.player1.dicepool.length).toBe(3);
            expect(this.player1).toHavePromptTitle('Meteor'); // choose AoE order
        });
    });
});
