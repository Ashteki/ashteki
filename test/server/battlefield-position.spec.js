describe('Battlefield Position', function () {
    describe('With multiple units', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'anchornaut', 'iron-worker', 'mist-spirit', 'gilder'],
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

        it('left most and right most units are correct', function () {
            expect(this.player1.player.isRightmostUnit(this.blueJaguar)).toBe(false);
            expect(this.player1.player.isLeftmostUnit(this.blueJaguar)).toBe(true);

            expect(this.player1.player.isRightmostUnit(this.gilder)).toBe(true);
            expect(this.player1.player.isRightmostUnit(this.ironWorker)).toBe(false);
        });
    });

    describe('With one unit', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar'],
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

        it('single unit is both left and rightmost', function () {
            expect(this.player1.player.isRightmostUnit(this.blueJaguar)).toBe(true);
            expect(this.player1.player.isLeftmostUnit(this.blueJaguar)).toBe(true);
        });
    });
});
