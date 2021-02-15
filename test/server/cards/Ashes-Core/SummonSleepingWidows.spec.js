describe('Summon Sleeping Widows', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'jessa-na-ni',
                inPlay: ['iron-worker'],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: []
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                spellboard: [],
                dicepool: ['natural', 'illusion', 'ceremonial', 'ceremonial'],
                hand: ['summon-sleeping-widows'],
                archives: ['sleeping-widow', 'sleeping-widow']
            }
        });
    });

    it('reaction available on unit destruction, puts 2 widows in play', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.anchornaut);
        this.player1.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter
        expect(this.anchornaut.location).toBe('discard');
        // prompt for jessa - Active player
        expect(this.player1).toHavePrompt('Any reactions to Anchornaut being destroyed?');
        this.player1.clickPrompt('Pass');
        expect(this.player2).toHavePrompt('Any reactions to Anchornaut being destroyed?');
        this.player2.clickCard(this.summonSleepingWidows);
        expect(this.player2).toBeAbleToSelect(this.player2.archives[0]);
        expect(this.player2).toBeAbleToSelect(this.player2.archives[1]);
        this.player2.clickCard(this.player2.archives[0]);
        this.player2.clickCard(this.player2.archives[1]);
        this.player2.clickPrompt('Done');
        expect(this.player2.inPlay.length).toBe(2);
    });
});
