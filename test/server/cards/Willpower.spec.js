describe('Willpower action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: ['anchornaut', 'mist-spirit'],
                dicepool: ['divine', 'charm', 'divine', 'charm'],
                hand: ['willpower', 'purge', 'abundance']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['silver-snake', 'iron-rhino', 'butterfly-monk'],
                spellboard: [],
                deck: ['purge', 'molten-gold', 'blink', 'summon-gilder']
            }
        });
    });

    it('deal damage equal to hand size', function () {
        this.player1.play(this.willpower);

        this.player1.clickDie(0);

        this.player1.clickCard(this.ironRhino);

        expect(this.ironRhino.damage).toBe(2);
    });
});
