describe('Summon Iron Rhino', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: [
                    'summon-butterfly-monk',
                    'abundance',
                    'summon-gilder',
                    'summon-iron-rhino',
                    'summon-iron-rhino',
                    'summon-iron-rhino'
                ],
                hand: ['summon-masked-wolf', 'summon-gilder', 'resonance'],
                dicepool: ['natural', 'natural', 'sympathy', 'sympathy', 'charm', 'charm']
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

    it('cost is still correct at focus 3', function () {
        expect(this.player1).toBeAbleToPlayFromHand('resonance');
        this.player1.clickCard(this.resonance);
        this.player1.clickPrompt('Play this ready spell');
        this.player1.clickDie(0);
        expect(this.player1).toHavePromptButton('Done');
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.summonIronRhino);
        this.player1.clickDie(0);
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done'); // Finished attaching Resonance to Summon Iron Rhino books

        this.player1.clickCard('summon-iron-rhino');
        this.player1.clickPrompt('Summon Iron Rhino');
        expect(this.player1).toHavePrompt('Select dice');
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDie(2);
        expect(this.player1).not.toHavePromptButton('Done');
        this.player1.clickDie(4);
        expect(this.player1).toHavePromptButton('Done');
    });
});
