describe('Summon Snapseed', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: [],
                spellboard: ['summon-snapseed'],
                dicepool: ['illusion', 'natural', 'artifice', 'charm'],
                archives: ['snapseed', 'snapseed']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: []
            }
        });
    });

    it('summon when not charged', function () {
        this.player1.clickCard(this.summonSnapseed);
        this.player1.clickPrompt('Summon Snapseed');

        expect(this.player1.inPlay.length).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('summon when charged', function () {
        this.player1.useDie(2);
        this.player1.clickCard(this.summonSnapseed);
        expect(this.summonSnapseed.isCharged).toBe(true);

        this.player1.clickCard(this.summonSnapseed);
        this.player1.clickPrompt('Summon Snapseed');

        expect(this.player1.inPlay.length).toBe(2);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
