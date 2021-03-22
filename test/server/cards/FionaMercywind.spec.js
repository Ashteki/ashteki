describe('Fiona ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'fiona-mercywind',
                inPlay: ['mist-spirit', 'iron-worker'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                spellboard: ['summon-gilder'],
                hand: ['massive-growth', 'deep-freeze']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['dispel']
            }
        });

        this.summonGilder.tokens.exhaustion = 1;
    });

    it('should remove exhaustion from ready spell', function () {
        this.player1.clickCard(this.fionaMercywind);
        this.player1.clickPrompt('Ingenuity');
        this.player1.clickCard(this.massiveGrowth);
        this.player1.clickPrompt('Remove Exhaustion');

        this.player1.clickCard(this.summonGilder);
        expect(this.summonGilder.exhausted).toBe(false);
    });
});
