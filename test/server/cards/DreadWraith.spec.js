describe('Dread Wraith', function () {
    describe('Rage 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['dread-wraith'],
                    dicepool: ['ceremonial', 'ceremonial', 'ceremonial', 'natural']
                }
            });
        });

        it('increases attack with wounds', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.dreadWraith);
            this.player1.clickCard(this.hammerKnight);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('Yes');
            expect(this.dreadWraith.attack).toBe(1 + this.hammerKnight.attack);
        });
    });
});
