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
                dicepool: ['natural', 'natural', 'charm', 'ceremonial']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage']
            }
        });
    });

    it('cannot play an ally - discarded instead', function () {
        // expect(this.player1).not.toBeAbleToPlayFromHand(this.hammerKnight);
        this.player1.play(this.hammerKnight);
        this.player1.clickYes(); // warning
        this.player1.clickDie(2);
        this.player1.clickDone();
        expect(this.hammerKnight.location).toBe('discard');
    });

    it('can use summon gilder, but not place gilder on battlefield', function () {
        expect(this.player1.inPlay.length).toBe(8);
        expect(this.player1).toBeAbleToPlayFromHand(this.summonGilder);
        this.player1.clickCard(this.summonGilder);
        this.player1.clickPrompt('Summon Gilder');
        this.player1.clickYes(); // warning

        expect(this.player1.inPlay.length).toBe(8);
        // additional test to ensure summon-gilder pings event when gilder not placed
        expect(this.player1).toHavePrompt('Deal 1 damage');
    });
});
