describe('Realization', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                hand: [],
                discard: ['purge', 'anchornaut', 'abundance', 'summon-gilder'],
                deck: [],
                spellboard: ['realization']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('with empty deck, shuffle discard, reveal and purge one, one to hand', function () {
        this.player1.clickCard(this.realization);
        this.player1.clickPrompt('Use Ability');
        expect(this.player1.discard.length).toBe(2);
        expect(this.player1.player.purged.length).toBe(1);
        expect(this.player1.hand.length).toBe(1);
    });
});
