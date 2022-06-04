describe('Natures Wrath', function () {
    describe('deals damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['natures-wrath'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'natural', 'ceremonial', 'charm'],
                    hand: [],
                    inPlay: ['mist-spirit', 'anchornaut']
                }
            });
        });

        it('deals damage to every unit', function () {
            this.player1.play(this.naturesWrath);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.mistSpirit);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.anchornaut.location).toBe('discard');
            expect(this.ironWorker.location).toBe('play area');
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('AoE damage sequences correctly', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['natures-wrath'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'natural', 'ceremonial', 'charm'],
                    hand: [],
                    inPlay: ['frostback-bear', 'butterfly-monk']
                }
            });

            this.frostbackBear.tokens.damage = 2;
        });

        it('monk can save bear', function () {
            this.player1.play(this.naturesWrath);
            this.player1.clickCard(this.butterflyMonk);
            expect(this.player2).toHavePrompt('Mend 1');
            this.player2.clickCard(this.frostbackBear);
            expect(this.butterflyMonk.location).toBe('archives');
            // this test fails if damage is applied simultaneously, and destroy events aren't backed out
            expect(this.frostbackBear.location).toBe('play area');
            expect(this.frostbackBear.damage).toBe(1);

            this.player1.clickCard(this.frostbackBear);
            expect(this.frostbackBear.damage).toBe(2);
            expect(this.frostbackBear.location).toBe('play area');
            expect(this.butterflyMonk.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('units limited to those at the point of targetting', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['natures-wrath'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'ceremonial', 'ceremonial', 'charm'],
                    hand: ['summon-sleeping-widows'],
                    inPlay: ['mist-spirit', 'anchornaut']
                }
            });
        });

        it('summon sleeping widows spiders survive', function () {
            this.player1.play(this.naturesWrath);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.anchornaut);
            this.player2.clickCard(this.summonSleepingWidows);

            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.mistSpirit);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.anchornaut.location).toBe('discard');
            expect(this.ironWorker.location).toBe('play area');
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('BUG: AoE damage failing vs shadow hound', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['natures-wrath'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'natural', 'ceremonial', 'charm'],
                    hand: [],
                    inPlay: ['frostback-bear', 'shadow-hound']
                }
            });
        });

        it('Wrath works as expected', function () {
            this.player1.play(this.naturesWrath);
            this.player1.clickCard(this.shadowHound);
            this.player1.clickCard(this.frostbackBear);
            expect(this.frostbackBear.damage).toBe(1);
            expect(this.frostbackBear.location).toBe('play area');
            expect(this.shadowHound.location).toBe('archives');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('BUG report: AoE damage failing vs flock shepherd', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['natures-wrath'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'natural', 'ceremonial', 'charm'],
                    hand: [],
                    inPlay: ['flock-shepherd', 'admonisher']
                }
            });
        });

        it('should resolve as expected', function () {
            this.player1.play(this.naturesWrath);
            this.player1.clickCard(this.admonisher);
            this.player1.clickCard(this.flockShepherd);
            expect(this.flockShepherd.damage).toBe(1);
            expect(this.flockShepherd.location).toBe('play area');
            expect(this.admonisher.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
