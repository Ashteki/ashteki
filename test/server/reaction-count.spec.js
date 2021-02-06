describe('Reaction Count', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['fire-archer'],
                dicepool: [
                    'ceremonial',
                    'ceremonial',
                    'ceremonial',
                    'ceremonial',
                    'ceremonial',
                    'charm',
                    'charm'
                ],
                spellboard: [],
                hand: ['summon-sleeping-widows', 'final-cry'],
                archives: ['sleeping-widow', 'sleeping-widow']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'mist-spirit'],
                spellboard: [],
                dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial']
            }
        });
    });

    it('BUG - two reaction test', function () {
        this.player1.clickCard(this.brennenBlackcloud);
        this.player1.clickPrompt('Spirit Burn');
        this.player1.clickCard(this.fireArcher);
        expect(this.fireArcher.location).toBe('discard');
        this.player1.clickCard(this.coalRoarkwin);
        expect(this.player1).toHavePrompt('Any reactions to Fire Archer leaving play?');
        this.player1.clickCard(this.summonSleepingWidows);
        expect(this.player1).toBeAbleToSelect(this.player1.archives[0]);
        expect(this.player1).toBeAbleToSelect(this.player1.archives[1]);
        this.player1.clickCard(this.player1.archives[0]);
        this.player1.clickCard(this.player1.archives[1]);
        this.player1.clickPrompt('Done');
        expect(this.player1.inPlay.length).toBe(2);
        expect(this.player1.discard.length).toBe(2); // summonSleepingWidows and fire archer
        expect(this.player1).not.toHavePrompt('Any reactions to Fire Archer leaving play?');
    });
});
