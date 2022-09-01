describe('standard trigger', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['blackcloud-ninja'],
                dicepool: [
                    'ceremonial',
                    'ceremonial',
                    'ceremonial',
                    'ceremonial',
                    'charm',
                    'charm'
                ],
                spellboard: ['chant-of-revenge'],
                hand: ['final-cry']
            },
            player2: {
                phoenixborn: 'leo-sunshadow',
                inPlay: [],
                spellboard: ['purge', 'summon-gilder'],
                hand: []
            }
        });
    });

    it('blackcloud attack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.leoSunshadow);
        this.player1.clickCard(this.blackcloudNinja);
        this.player1.clickDone();
        this.player1.clickCard(this.blackcloudNinja);

        this.player2.clickCard(this.purge);

        expect(this.leoSunshadow.damage).toBe(1);
        expect(this.player1.player.limitedPlayed).toBe(0);
        this.player1.clickCard(this.brennenBlackcloud);
        this.player1.clickPrompt('Spirit Burn');
        this.player1.clickCard(this.blackcloudNinja);

        expect(this.chantOfRevenge.status).toBe(1);
        expect(this.player1.player.limitedPlayed).toBe(0);
        expect(this.player1).toHavePrompt('Any reactions to blackcloud ninja being destroyed?');

        this.player1.clickPass();
        this.player1.clickCard(this.leoSunshadow);
        expect(this.leoSunshadow.damage).toBe(3);
    });
});
