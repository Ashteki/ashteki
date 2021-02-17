describe('frostbite focussed', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'anchornaut'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                hand: [],
                spellboard: ['frost-bite', 'frost-bite']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['hammer-knight', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
    });

    it('BUG: 1 damage to pb, ensure only one exhausts', function () {
        this.player1.clickCard(this.player1.spellboard[0]);
        this.player1.clickPrompt('Frost Bite');
        this.player1.clickDie(1);
        this.player1.clickCard(this.aradelSummergaard);
        expect(this.aradelSummergaard.damage).toBe(1);
        expect(this.player1.spellboard[0].exhausted).toBe(true);
        expect(this.player1.spellboard[1].exhausted).toBe(false);
    });
});
