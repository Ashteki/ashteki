describe('Three eyed Owl', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['three-eyed-owl'],
                dicepool: ['charm', 'charm'],
                hand: ['summon-masked-wolf'],
                spellboard: ['purge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                hand: ['summon-butterfly-monk', 'enchanted-violinist']
            }
        });
    });

    it('discards opponents card', function () {
        this.player1.clickCard(this.threeEyedOwl);
        this.player1.clickPrompt('Memory Drain 1');
        this.player1.clickPrompt('Opponent');

        this.player2.clickCard(this.summonButterflyMonk);

        expect(this.summonButterflyMonk.location).toBe('discard');
        expect(this.enchantedViolinist.location).toBe('hand');
    });

    it('discards my card', function () {
        this.player1.clickCard(this.threeEyedOwl);
        this.player1.clickPrompt('Memory Drain 1');
        this.player1.clickPrompt('Me');

        this.player1.clickCard(this.summonMaskedWolf);

        expect(this.summonMaskedWolf.location).toBe('discard');
        expect(this.player1.hand.length).toBe(0);
    });
});
