const { Level } = require('../../../server/constants');

describe('Summon River Colossus', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-river-colossus'],
                    dicepool: [
                        'charm',
                        'time',
                        'natural',
                        'natural',
                        'time',
                        'sympathy',
                        'sympathy'
                    ],
                    archives: ['river-colossus']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: []
                }
            });
        });

        it('should place a river colossus into play', function () {
            this.player1.clickCard(this.summonRiverColossus);
            this.player1.clickPrompt('Summon River Colossus');
            this.player1.clickDie(0);
            this.player1.clickDone();
            expect(this.riverColossus.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('when focus 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: [
                        'summon-river-colossus',
                        'summon-river-colossus',
                        'summon-river-colossus'
                    ],
                    dicepool: [
                        'charm',
                        'time',
                        'natural',
                        'natural',
                        'time',
                        'sympathy',
                        'sympathy'
                    ],
                    archives: ['river-colossus']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: []
                }
            });

            this.player1.dicepool[1].level = 'basic';
            this.player1.dicepool[2].level = 'basic';
            this.player1.dicepool[3].level = 'basic';
            this.player1.dicepool[3].level = 'class';
        });

        it('change four dice in own active pool', function () {
            this.player1.clickCard(this.summonRiverColossus);
            this.player1.clickPrompt('Summon River Colossus');

            this.player1.clickDie(0);
            this.player1.clickDone();
            expect(this.riverColossus.location).toBe('play area');

            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDie(3);
            this.player1.clickDie(4);
            this.player1.clickDone();

            expect(this.player1.dicepool[1].level).toBe(Level.Power);
            expect(this.player1.dicepool[2].level).toBe(Level.Power);
            expect(this.player1.dicepool[3].level).toBe(Level.Power);
            expect(this.player1.dicepool[4].level).toBe(Level.Power);
            expect(this.player2).toHavePrompt('Waiting for opponent');
        });
    });
});
