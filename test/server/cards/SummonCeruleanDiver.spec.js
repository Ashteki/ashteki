const { Level } = require('../../../server/constants');

describe('Summon Cerulean Diver', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-cerulean-diver'],
                    dicepool: ['charm', 'time', 'sympathy', 'sympathy'],
                    archives: ['cerulean-diver']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: []
                }
            });

            this.player1.dicepool[2].level = Level.Class;
            this.player1.dicepool[3].level = Level.Class;
        });

        it('should place a cerulean diver into play - no power die, no ping', function () {
            this.player1.clickCard(this.summonCeruleanDiver);
            this.player1.clickPrompt('Summon Cerulean Diver');
            this.player1.clickDone();
            expect(this.ceruleanDiver.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('when focus 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-cerulean-diver', 'summon-cerulean-diver'],
                    dicepool: ['charm', 'time', 'sympathy'],
                    archives: ['cerulean-diver']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: []
                }
            });
        });

        it('spend a power die to ping 1 damage', function () {
            expect(this.player1.dicepool[2].level).toBe(Level.Power);
            this.player1.clickCard(this.summonCeruleanDiver);
            this.player1.clickPrompt('Summon Cerulean Diver');
            this.player1.clickDone();

            expect(this.ceruleanDiver.location).toBe('play area');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('when focus 1 but no bf space', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    spellboard: ['summon-cerulean-diver', 'summon-cerulean-diver'],
                    dicepool: ['charm', 'time', 'sympathy'],
                    inPlay: ['anchornaut', 'iron-rhino', 'pain-shaman', 'frostback-bear'],
                    archives: ['cerulean-diver']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: []
                }
            });
        });

        it('spend a power die to ping 1 damage', function () {
            expect(this.player1.dicepool[2].level).toBe(Level.Power);
            this.player1.clickCard(this.summonCeruleanDiver);
            this.player1.clickPrompt('Summon Cerulean Diver');
            this.player1.clickDone();

            expect(this.ceruleanDiver.location).toBe('archives');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('when focus 1 but at conji limit', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'jessa-na-ni',
                    spellboard: ['summon-cerulean-diver', 'summon-cerulean-diver'],
                    dicepool: ['charm', 'time', 'sympathy'],
                    inPlay: ['cerulean-diver', 'cerulean-diver', 'frostback-bear'],
                    archives: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: []
                }
            });
        });

        it('spend a power die to ping 1 damage', function () {
            expect(this.player1.dicepool[2].level).toBe(Level.Power);
            this.player1.clickCard(this.summonCeruleanDiver);
            this.player1.clickPrompt('Summon Cerulean Diver');
            this.player1.clickDone();

            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
