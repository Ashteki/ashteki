describe('Reaping Angel', function () {
    describe('Offer', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    discard: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'divine', 'ceremonial', 'sympathy'],
                    hand: ['reaping-angel', 'molten-gold'],
                    deck: ['iron-worker', 'open-memories']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight'],
                    spellboard: ['summon-butterfly-monk']
                }
            });

            this.coalRoarkwin.tokens.damage = 8;
        });

        it('should heal pb when purging from discard after draw pile discard', function () {
            this.player1.play(this.reapingAngel);
            this.player1.clickYes();
            this.player1.clickCard(this.ironWorker); // in draw pile
            expect(this.ironWorker.location).toBe('discard');

            this.player1.clickYes();
            this.player1.clickCard(this.anchornaut); // in discard
            expect(this.anchornaut.location).toBe('purged');
            expect(this.coalRoarkwin.damage).toBe(7);
        });

        it('should allow purge from draw pile independent of discard', function () {
            this.player1.play(this.reapingAngel);
            this.player1.clickNo();
            expect(this.ironWorker.location).toBe('deck');

            this.player1.clickYes();
            this.player1.clickCard(this.anchornaut); // in discard
            expect(this.anchornaut.location).toBe('purged');
            expect(this.coalRoarkwin.damage).toBe(7);
        });
    });
});
