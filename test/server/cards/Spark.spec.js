describe('Spark', function () {
    describe('Basic tests', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['mist-spirit', 'blue-jaguar', 'anchornaut'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                }
            });
        });

        it('modifies card attack', function () {
            this.player1.clickCard(this.luluFirststone);
            this.player1.clickPrompt('Bolster');
            this.player1.clickDie(0);
            this.player1.clickCard(this.mistSpirit); // attach to ms

            expect(this.mistSpirit.status).toBe(1);
            expect(this.mistSpirit.attack).toBe(2);
        });

        it('spark discards to deal 1 to unit', function () {
            this.player1.clickCard(this.luluFirststone);
            this.player1.clickPrompt('Bolster');
            this.player1.clickDie(0);
            this.player1.clickCard(this.mistSpirit); // attach to ms

            this.player1.clickCard(this.spark);
            this.player1.clickPrompt('Spark');
            this.player1.clickCard(this.ironWorker);
            expect(this.spark.location).toBe('archives');
            expect(this.ironWorker.damage).toBe(1);
        });
    });

    describe('vs Golden Veil', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['mist-spirit', 'blue-jaguar', 'anchornaut'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat'],
                    archives: ['spark']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['golden-veil'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                }
            });
        });

        it('spark damage prevented but is still discarded', function () {
            this.player1.clickCard(this.luluFirststone);
            this.player1.clickPrompt('Bolster');
            this.player1.clickDie(0);
            this.player1.clickCard(this.mistSpirit); // attach to ms

            this.player1.clickCard(this.spark);
            this.player1.clickPrompt('Spark');
            this.player1.clickCard(this.ironWorker);
            this.player2.clickCard(this.goldenVeil);

            expect(this.spark.location).toBe('archives');
            expect(this.ironWorker.damage).toBe(0);
        });
    });
});