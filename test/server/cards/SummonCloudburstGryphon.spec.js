describe('Summon Cloudburst Gryphon', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: ['summon-cloudburst-gryphon'],
                dicepool: ['time', 'divine'],
                archives: ['cloudburst-gryphon']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['anchornaut']
            }
        });
    });

    it('place on battlefield', function () {
        this.player1.clickCard(this.summonCloudburstGryphon);
        this.player1.clickPrompt('Summon Cloudburst Gryphon');
        expect(this.cloudburstGryphon.location).toBe('play area');
    });
});
