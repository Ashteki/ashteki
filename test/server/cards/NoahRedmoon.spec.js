describe('Noah Redmoon', function () {
    describe('shadow target ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'noah-redmoon',
                    inPlay: ['flute-mage'],
                    hand: ['resummon'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blood-archer', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                    spellboard: ['summon-gilder'],
                    archives: ['gilder']
                }
            });
        });

        it('exhausts a ready spell', function () {
            expect(this.summonGilder.exhausted).toBe(false);
            this.player1.clickCard(this.noahRedmoon);
            this.player1.clickPrompt('Shadow Target');
            this.player1.clickDie(0);
            this.player1.clickCard(this.summonGilder);
            expect(this.summonGilder.exhausted).toBe(true);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('shadow target vs Vanish', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'noah-redmoon',
                    inPlay: ['flute-mage'],
                    hand: ['resummon'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blood-archer', 'mist-spirit'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                    spellboard: ['summon-gilder'],
                    archives: ['gilder'],
                    hand: ['vanish']
                }
            });
        });

        it('can be cancelled by vanish', function () {
            expect(this.summonGilder.exhausted).toBe(false);
            this.player1.clickCard(this.noahRedmoon);
            this.player1.clickPrompt('Shadow Target');
            this.player1.clickDie(0);
            this.player1.clickCard(this.summonGilder);
            this.player2.clickCard(this.vanish);
            expect(this.summonGilder.exhausted).toBe(false);
            expect(this.vanish.location).toBe('discard');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
