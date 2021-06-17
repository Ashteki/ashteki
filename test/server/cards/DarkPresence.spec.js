describe('Dark Presence', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'frostback-bear'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: ['dark-presence'],
                    hand: ['power-through']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin', // battlefield 6
                    inPlay: ['mist-spirit', 'anchornaut', 'hammer-knight', 'salamander-monk'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['salamander-monk-spirit']
                }
            });
        });

        it('grants terrifying to unit', function () {
            expect(this.ironWorker.hasKeyword('terrifying')).toBe(false);
            this.player1.clickCard(this.darkPresence);
            this.player1.clickPrompt('dark presence');
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.hasKeyword('terrifying')).toBe(true);
        });

        it('grants terrifying increase to FBB', function () {
            expect(this.frostbackBear.getKeywordValue('terrifying')).toBe(1);
            this.player1.clickCard(this.darkPresence);
            this.player1.clickPrompt('dark presence');
            this.player1.clickCard(this.frostbackBear);
            expect(this.frostbackBear.getKeywordValue('terrifying')).toBe(2);
        });
    });
});
