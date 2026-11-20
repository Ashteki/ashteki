describe('SeaVoid Phantom', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['flute-mage'],
                    dicepool: ['sympathy', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-gilder'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['hammer-knight', 'anchornaut', 'void-phantom'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('attack when not exhausted damages as normal', function () {
            this.player1.clickAttack(this.voidPhantom);
            this.player1.clickCard(this.fluteMage);
            this.player2.clickDone();
            this.player2.clickNo(); // counter

            expect(this.voidPhantom.location).toBe('archives'); // dead
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('attack when exhausted reduces damage by 1', function () {
            this.voidPhantom.exhaust();
            expect(this.voidPhantom.exhausted).toBe(true);

            this.player1.clickAttack(this.voidPhantom);
            this.player1.clickCard(this.fluteMage);
            this.player2.clickDone();
            // this.player2.clickNo(); // no counter prompt because exhausted

            expect(this.voidPhantom.location).toBe('play area'); // not dead
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
