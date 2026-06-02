const Dice = require('../../../server/game/dice');

describe('Searing Bolt', function () {
    describe('with one target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'astral', 'astral'],
                    spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                    archives: ['the-awakened-state'],
                    hand: ['anchornaut', 'hurricane', 'searing-bolt', 'rayward-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                    inPlay: ['beast-tamer', 'blue-jaguar', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('deal 2 damage to highest life unit', function () {
            this.player1.play(this.searingBolt);

            expect(this.player1).toBeAbleToSelect(this.hammerKnight);
            expect(this.player1).not.toBeAbleToSelect(this.blueJaguar);
            expect(this.player1).not.toBeAbleToSelect(this.beastTamer);

            this.player1.clickCard(this.hammerKnight);

            expect(this.hammerKnight.damage).toBe(2);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('vs dragonborn', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'astral', 'astral'],
                    spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                    archives: ['the-awakened-state'],
                    hand: ['hurricane', 'rayward-knight'],
                    deck: ['anchornaut', 'hurricane', 'searing-bolt', 'rayward-knight']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    threatZone: ['sear', 'aegis-feathers'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
        });

        it('deal 2 damage to highest life unit', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(4);
            this.player1.endTurn();
            this.player1.clickOk();

            this.player1.useAbility(this.kannaGaleheart);
            this.player1.clickPrompt('Searing Bolt');
            this.player1.play(this.searingBolt);
            this.player1.clickCard(this.sear);

            expect(this.sear.location).toBe('discard');

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('with no target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'astral', 'astral'],
                    spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                    archives: ['the-awakened-state'],
                    hand: ['anchornaut', 'hurricane', 'searing-bolt', 'rayward-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                    inPlay: [],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('deal 2 damage to highest life unit', function () {
            this.player1.play(this.searingBolt);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('with more than one target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'astral', 'astral'],
                    spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                    archives: ['the-awakened-state'],
                    hand: ['anchornaut', 'hurricane', 'searing-bolt', 'rayward-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                    inPlay: ['beast-tamer', 'blue-jaguar', 'hammer-knight', 'ember-heart'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('deal 2 damage to highest life unit', function () {
            this.player1.play(this.searingBolt);

            expect(this.player1).toBeAbleToSelect(this.hammerKnight);
            expect(this.player1).toBeAbleToSelect(this.emberHeart);
            expect(this.player1).not.toBeAbleToSelect(this.blueJaguar);
            expect(this.player1).not.toBeAbleToSelect(this.beastTamer);

            this.player1.clickCard(this.emberHeart);

            expect(this.emberHeart.damage).toBe(2);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
