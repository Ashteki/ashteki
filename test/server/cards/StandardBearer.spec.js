describe('standard bearer', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['standard-bearer', 'mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'illusion', 'charm'],
                hand: []
            }
        });
        this.standardBearer.tokens.status = 2;
    });

    it('adds 1 to a unit for each status', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.standardBearer);
        this.player1.clickPrompt('Done'); // done for attackers
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickDone();
        expect(this.mistSpirit.attack).toBe(2);
        this.player2.clickDone();
        this.player1.clickCard(this.mistSpirit);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.coalRoarkwin.damage).toBe(3);
    });
});
