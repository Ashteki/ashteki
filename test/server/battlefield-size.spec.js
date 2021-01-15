describe('When Battlefield is full', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: [
                    'blue-jaguar',
                    'mist-spirit',
                    'iron-worker',
                    'iron-worker',
                    'blue-jaguar',
                    'mist-spirit',
                    'iron-worker',
                    'iron-worker'
                ],
                spellboard: [
                    'summon-butterfly-monk',
                    'abundance',
                    'summon-gilder',
                    'summon-iron-rhino'
                ],
                hand: ['hammer-knight'],
                archives: ['gilder'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage']
            }
        });
    });

    it('cannot play an ally', function () {
        expect(this.player1).not.toBeAbleToPlayFromHand(this.hammerKnight);
    });

    it('can use summon gilder, but not place gilder on battlefield', function () {
        expect(this.player1).toBeAbleToPlayFromHand(this.summonGilder);
        this.player1.clickCard(this.summonGilder);
        this.player1.clickPrompt('Summon Gilder');

        this.player1.clickCard(this.gilder);
        expect(this.player1.inPlay.length).toBe(8);
    });
});
