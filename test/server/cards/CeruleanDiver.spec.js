describe(' Cerulean Diver', function () {
    describe('Dive 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['cerulean-diver', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['molten-gold'],
                    archives: ['spark'],
                    deck: ['purge', 'abundance', 'summon-gilder']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'mist-spirit'],
                    spellboard: ['keepsake']
                }
            });
        });

        it('on attack draws 1 card from bottom deck', function () {
            this.player1.player.deck = [this.purge, this.abundance, this.summonGilder];
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.ceruleanDiver);

            expect(this.summonGilder.location).toBe('hand');
        });

        it('bug: on attack with only 1 card in deck', function () {
            this.player1.player.deck = [this.purge];
            this.player1.clickAttack(this.fluteMage);
            this.player1.clickCard(this.ceruleanDiver);

            expect(this.purge.location).toBe('hand');
        });
    });
});
