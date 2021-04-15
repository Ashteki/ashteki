describe('When Spellboard is full', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: [
                    'summon-butterfly-monk',
                    'abundance',
                    'summon-gilder',
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

    it('can play an existing spell', function () {
        expect(this.player1).toBeAbleToPlayFromHand('summon-gilder');
    });

    it('can play resonance', function () {
        expect(this.player1).toBeAbleToPlayFromHand('resonance');
    });

    it('cannot play a new spell', function () {
        expect(this.player1).not.toBeAbleToPlayFromHand('summon-masked-wolf');
    });
});
