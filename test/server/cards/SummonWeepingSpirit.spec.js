describe('Summon Weeping Spirit', function () {
    describe('positive tests', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-weeping-spirit'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    archives: ['weeping-spirit'],
                    deck: ['iron-worker', 'anchornaut'],
                    hand: ['iron-worker', 'anchornaut']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm']
                }
            });
        });

        it('should place a blood puppet onto own battlefield', function () {
            this.player1.clickCard(this.summonWeepingSpirit);
            this.player1.clickPrompt('Summon Weeping Spirit');
            this.player1.clickPrompt('Mine');

            // Blood puppet is now on the battlefield
            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player2.inPlay.length).toBe(0);
        });

        it('should place a blood puppet onto opponents battlefield', function () {
            expect(this.player2.side).toBe(1);

            this.player1.clickCard(this.summonWeepingSpirit);
            this.player1.clickPrompt('Summon Weeping Spirit');
            this.player1.clickPrompt("Opponent's");

            // Blood puppet is now on the battlefield
            expect(this.player1.inPlay.length).toBe(0);
            expect(this.player2.inPlay.length).toBe(1);
            expect(this.weepingSpirit.controller.id).toBe('222');
        });
    });
});
