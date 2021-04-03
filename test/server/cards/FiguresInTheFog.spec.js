describe('Figures in the fog reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: ['butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                hand: ['figures-in-the-fog'],
                dicepool: ['natural', 'illusion']
            }
        });
    });

    it('can be played when attackers are declared - Unit attack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.ironWorker); // single attacker

        // card played
        expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
    });

    it('can be played when attackers are declared - PB attack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.ironWorker); // single attacker
        this.player1.clickPrompt('Done');

        // card played
        expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
    });
});
