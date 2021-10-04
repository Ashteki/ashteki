describe('Secret Door', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['crimson-bomber', 'mist-spirit'],
                spellboard: ['secret-door'],
                dicepool: ['illusion']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight']
            }
        });
    });

    it('unit should be unblockable', function () {
        this.player1.clickCard(this.secretDoor);
        this.player1.clickPrompt('Secret Door a unit');
        expect(this.player1).not.toBeAbleToSelect(this.crimsonBomber);
        expect(this.player1).toBeAbleToSelect(this.mistSpirit);
        this.player1.clickCard(this.mistSpirit);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickPrompt('Done');
        expect(this.player2).toHavePrompt('Waiting for opponent'); // defender didn't get option to block
    });

    it('unit should be guardable', function () {
        this.player1.clickCard(this.secretDoor);
        this.player1.clickPrompt('Secret Door a unit');
        this.player1.clickCard(this.mistSpirit);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.crimsonBomber);
        expect(this.player1).toHavePrompt('Waiting for opponent to guard'); // they have option to guard
    });
});
