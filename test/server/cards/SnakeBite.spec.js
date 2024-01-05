describe('Snake Bite', function () {
    describe('Enters play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit'],
                    dicepool: ['divine', 'charm', 'charm'],
                    hand: ['snake-bite'],
                    discard: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('Enters play allows charm die resolution', function () {
            this.player1.play(this.snakeBite);
            expect(this.snakeBite.location).toBe('spellboard');
            expect(this.player1).not.toBeAbleToSelectDie(this.player1.dicepool[0]);

            this.player1.clickDie(1);
            this.player1.clickCard(this.frostFang);
            expect(this.frostFang.attack).toBe(2);
        });
    });

    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit'],
                    dicepool: ['divine', 'charm', 'charm'],
                    spellboard: ['snake-bite'],
                    discard: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['safeguard']
                }
            });
        });

        it('Deal damage to a charm target', function () {
            this.player1.useDie(1);
            this.player1.clickCard(this.ironWorker);

            this.player1.clickCard(this.snakeBite);
            this.player1.clickPrompt('Snake Bite');
            expect(this.player1).not.toBeAbleToSelect(this.frostFang);
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.damage).toBe(1);
        });
    });

    describe('In Play - Focus 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit'],
                    dicepool: ['divine', 'charm', 'charm'],
                    spellboard: ['snake-bite', 'snake-bite'],
                    discard: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['safeguard']
                }
            });
        });

        it('Deal damage to a pb if deck empty', function () {
            this.player2.player.deck = [];
            this.player1.useDie(1);
            this.player1.clickCard(this.ironWorker);

            this.player1.clickCard(this.snakeBite);
            this.player1.clickPrompt('Snake Bite');

            expect(this.player1).toBeAbleToSelect(this.aradelSummergaard);
            expect(this.player1).not.toBeAbleToSelect(this.frostFang);
            this.player1.clickCard(this.aradelSummergaard);
            expect(this.aradelSummergaard.damage).toBe(1);
        });

        it('Not to deal damage to a pb if deck not empty', function () {
            this.player1.useDie(1);
            this.player1.clickCard(this.ironWorker);

            this.player1.clickCard(this.snakeBite);
            this.player1.clickPrompt('Snake Bite');

            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            expect(this.player1).not.toBeAbleToSelect(this.frostFang);
            expect(this.player1).not.toBeAbleToSelect(this.aradelSummergaard);
            this.player1.clickCard(this.aradelSummergaard);
            expect(this.aradelSummergaard.damage).toBe(0);
        });
    });
});
