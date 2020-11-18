describe('Summon Butterfly Monk', function () {
    describe("Summon Butterfly Monk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should heal 1 from all friendly creatures', function () {
            this.player1.useAction(this.summonButterflyMonk, true);

            // expect what?

            expect(this.player1.battlefield.size).toBe(1);
            expect(this.pride.tokens.damage).toBeUndefined();
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.shooler.tokens.damage).toBeUndefined();

            expect(this.desire.tokens.damage).toBe(2);
            expect(this.culfTheQuiet.tokens.damage).toBeUndefined();
        });
    });
});
