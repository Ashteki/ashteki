const Dice = require("../../../server/game/dice");

describe('Meteor', function () {
    describe('PvP action spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['hammer-knight'],
                    dicepool: ['divine', 'divine', 'divine', 'charm'],
                    hand: ['meteor'],
                    spellboard: ['chant-of-revenge']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['silver-snake', 'mist-spirit'],
                    spellboard: []
                }
            });

            this.player1.dicepool[0].level = 'class';
        });

        it('damages all units in play', function () {
            this.player1.dicepool[1].level = 'class';
            this.player1.dicepool[2].level = 'class';

            this.player1.clickCard(this.meteor);
            this.player1.clickPrompt('Play this action');
            // no click of dice - preselected
            this.player1.clickPrompt('Done');
            // one damage ordered by player
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.silverSnake);
            this.player1.clickCard(this.mistSpirit);
            expect(this.hammerKnight.damage).toBe(1);
            expect(this.silverSnake.damage).toBe(1);
            expect(this.mistSpirit.location).toBe('archives');
        });

        it('damages all units in play plus one', function () {
            this.player1.clickCard(this.meteor);
            this.player1.clickPrompt('Play this action');
            // no click of dice - preselected
            this.player1.clickPrompt('Done');
            // one damage
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.silverSnake);
            this.player1.clickCard(this.mistSpirit);
            // additional 1 lion
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.silverSnake);
            this.player1.clickCard(this.mistSpirit);

            expect(this.hammerKnight.damage).toBe(2);
            expect(this.silverSnake.damage).toBe(2);
            expect(this.mistSpirit.location).toBe('archives');
        });

        it('damages all units in play plus two', function () {
            this.player1.clickCard(this.meteor);
            this.player1.clickPrompt('Play this action');
            this.player1.clickDie(0); // remove class
            this.player1.clickDie(2); // add power
            this.player1.clickPrompt('Done');
            // one damage
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.silverSnake);
            this.player1.clickCard(this.mistSpirit);
            // two lions damage
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.silverSnake);
            this.player1.clickCard(this.mistSpirit);
            expect(this.hammerKnight.damage).toBe(3);
            expect(this.silverSnake.damage).toBe(3);
            expect(this.mistSpirit.location).toBe('archives');
        });
    });

    describe('vs Chimera: on dice spent', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['mist-spirit', 'enchanted-violinist', 'rayward-recruit', 'meteor'],
                    spellboard: ['piercing-light'],
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
            // expect(this.scarletSeed.location).toBe('play area');
            this.player1.play(this.meteor);
            this.player1.clickDone();
            // check spellboard is still just 1
            expect(this.player1.dicepool.length).toBe(5);
            expect(this.player1).toHavePromptTitle('Meteor'); // choose AoE order
        });
    });
});
